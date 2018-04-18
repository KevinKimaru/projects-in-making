package com.kevin;

import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.ScheduledService;
import javafx.concurrent.Task;
import javafx.concurrent.WorkerStateEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.print.PrinterJob;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.TilePane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

public class HomeController {
    @FXML
    private TilePane dishesTilePane;
    @FXML
    private VBox categoriesVBox;
    @FXML
    private TableView ordersTable;
    @FXML
    private TableColumn delColumn;
    @FXML
    private TableColumn decrColumn;
    @FXML
    private TableColumn dishColumn;
    @FXML
    private TableColumn priceColumn;
    @FXML
    private TableColumn quantColumn;
    @FXML
    private TableColumn totalColumn;
    @FXML
    private Label totalLabel;
    @FXML
    private JFXComboBox<String> waiterComboBox;
    @FXML
    private JFXComboBox<Integer> tableComboBox;
    @FXML
    private Label timeLabel;
    @FXML
    private ProgressBar progressBar;
    @FXML
    private Label statusLabel;
    @FXML
    private MenuItem ordersBtn;

    String[] colors = new String[]{
            "#993300",
            "#8e24aa",
            "#43a047",
            "#e53935",
    };

    private ObservableList<OrderDataModel> orderData = FXCollections.observableArrayList();

    public List<Order> orders = new ArrayList<>();
    public List<Order> pendingOrders = new ArrayList<>();

    public static final String WAITERS_API_URL = "http://localhost:3000/api/waiters";
    public static final String ORDERS_API_URL = "http://localhost:3000/api/customerOrder";
    public static final String FOOD_CATEGORIES_API_URL = "http://localhost:3000/api/foodCategories";
    public static final String FOODS_API_URL = "http://localhost:3000/api/foods";
    public static final String IMAGE_URI = "file:///F:/PROJECTS/CLIENT_PROJECTS/hotel-management/src/main/resources/images/breakfast/1.jpeg";

    public static final int TABLES = 10;

    public HomeController() {

    }

    public List<Order> getOrders() {
        return orders;
    }

    public List<Order> getPendingOrders() {
        return pendingOrders;
    }

    public void refreshHome() {
        ScheduledService<Object> service = new ScheduledService<Object>() {
            @Override
            protected Task<Object> createTask() {
                return new Task<Object>() {
                    @Override
                    protected Object call() throws Exception {
                        try {
                            QueryUtils.setFoodCategories(FOOD_CATEGORIES_API_URL);
                            QueryUtils.setFoods(FOODS_API_URL);
                            QueryUtils.setWaiters(WAITERS_API_URL);
                        } catch (Exception e) {
                            System.err.println(e.getMessage());
                            return e.getMessage();
                        }
                        return null;
                    }
                };
            }
        };
        service.setOnSucceeded(e -> {
            progressBar.setVisible(false);
            if (e.getSource().getValue() == null) {
                setReadyTable();
                setComboBoxesData();
                setCategoryVBoxBtns();
                setTilePaneBtns();
                showTime();
                statusLabel.setText("Data fetched successfully");
                service.cancel();
            } else {
                statusLabel.setText("Error fetching data.");
                service.cancel();
                Alert errAlert = new Alert(Alert.AlertType.ERROR);
                errAlert.setContentText("Error fetching data:\n " + e.getSource().getValue() + " Please try again later " +
                        "or consult admin. ");
                errAlert.showAndWait();
            }
        });
        service.setOnRunning(e -> {statusLabel.setText("Fetching data....");
        });
        service.setOnFailed(e -> statusLabel.setText("Fetching data failed. Please try again later or consult admin."));
        progressBar.setVisible(true);
        service.start();
    }

    public void openOrdersWindow() throws IOException {
        Stage ordersStage = new Stage();
        ordersStage.setTitle("Orders");
        Parent root = FXMLLoader.load(getClass().getResource("/fxml/orders.fxml"));
        ordersStage.setScene(new Scene(root));
        ordersStage.show();
        System.out.println(orders);
        System.out.println(pendingOrders);
    }

    private void setReadyTable() {
        delColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, JFXButton>("delete"));
        decrColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, JFXButton>("decrement"));
        dishColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("dish"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("price"));
        quantColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("quantity"));
        totalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("total"));
    }

    private void setComboBoxesData() {
        ObservableList<String> waiters = FXCollections.observableArrayList();
        for (Waiter waiter : QueryUtils.waiters) {
            waiters.add(waiter.getFullName());
        }
        waiterComboBox.setItems(waiters);

        ObservableList<Integer> tables = FXCollections.observableArrayList();
        for (int i = 1; i <= TABLES; i++) {
            tables.add(i);
        }
        tableComboBox.setItems(tables);
    }

    public void setTilePaneBtns() {
        dishesTilePane.getChildren().removeAll(dishesTilePane.getChildren());
        int i = 0;
        for (Food food : QueryUtils.foods) {
            setOneDish(food, i);
            i++;
        }
    }

    public void setCategoryVBoxBtns() {
        categoriesVBox.getChildren().removeAll(categoriesVBox.getChildren());
        JFXButton categoryBtn = new JFXButton("All");
        categoryBtn.setMaxWidth(Double.MAX_VALUE);
        categoryBtn.setStyle("-fx-background-color: #ffb3b3;-fx-text-fill: #000; -fx-font-size: 16px;");
        categoryBtn.setOnAction(e -> {
            setTilePaneBtns();
        });
        categoriesVBox.getChildren().add(categoryBtn);
        int i = 0;
        for (FoodCategory category : QueryUtils.foodCategories) {
            JFXButton icategoryBtn = new JFXButton(category.getName());
            icategoryBtn.setMaxWidth(Double.MAX_VALUE);
            icategoryBtn.setStyle("-fx-background-color: #ffb3b3;-fx-text-fill: #000; -fx-font-size: 16px;");
            int finalI = i;
            icategoryBtn.setOnAction(e -> {
                dishesTilePane.getChildren().removeAll(dishesTilePane.getChildren());
                for (Food food : QueryUtils.foods) {
                    if (food.getCategory().equals(category)) {
                        setOneDish(food, finalI);
                    }
                }
            });
            categoriesVBox.getChildren().add(icategoryBtn);
            i++;
        }
    }

    private void setOneDish(Food food, int i) {
        JFXButton dishButton = new JFXButton(food.getName() + "\n" + food.getPrice());
        dishButton.setPrefSize(140, 140);
        dishButton.setStyle("-fx-background-color:" + colors[i % colors.length] + ";-fx-text-fill: #fff; -fx-font-size: 16px;");
        dishButton.setWrapText(true);
        dishButton.setUserData(food.getId());
        dishesTilePane.getChildren().add(dishButton);

        dishButton.setOnAction(e -> {
            onSelectFood(dishButton);
        });
    }

    private void onSelectFood(JFXButton dishButton) {
        Food selectedFood = findFoodById((String) dishButton.getUserData());
        boolean present = false;
        for (int i = 0; i < orderData.size(); i++) {
            OrderDataModel model = orderData.get(i);
            if (model.getDishId().equals(selectedFood.getId())) {
                model.setQuantity(model.getQuantity() + 1);
                model.setTotal(model.getQuantity() * model.getPrice());
                orderData.set(i, model);
                present = true;
                break;
            }
        }

        if (!present) {
            JFXButton delBtn = new JFXButton();
            delBtn.setGraphic(new ImageView(new Image(getClass().getResourceAsStream("/images/delete.png"))));
            JFXButton decrBtn = new JFXButton();
            decrBtn.setGraphic(new ImageView(new Image(getClass().getResourceAsStream("/images/decrement.png"))));
            OrderDataModel dataModel = new OrderDataModel(selectedFood.getName(),
                    selectedFood.getPrice(), 1, selectedFood.getPrice(), selectedFood.getId(),
                    delBtn, decrBtn, null, null, null, null, null);
            dataModel.getDelete().setOnAction(e -> {
                orderData.remove(dataModel);
                calaculateTotal();
            });
            dataModel.getDecrement().setOnAction(e -> {
                if (dataModel.getQuantity() == 1) {
                    orderData.remove(dataModel);
                    calaculateTotal();
                } else {
                    for (int i = 0; i < orderData.size(); i++) {
                        OrderDataModel model = orderData.get(i);
                        if (model.getDishId().equals(dataModel.getDishId())) {
                            model.setQuantity(model.getQuantity() - 1);
                            model.setTotal(model.getQuantity() * model.getPrice());
                            orderData.set(i, model);
                            break;
                        }
                    }
                    calaculateTotal();
                }
            });
            orderData.add(dataModel);
        }
        calaculateTotal();
        ordersTable.setItems(orderData);
    }

    private void calaculateTotal() {
        int grossTotal = 0;
        for (OrderDataModel dataModel : orderData) {
            grossTotal += dataModel.getTotal();
        }
        totalLabel.setText(String.valueOf(grossTotal));
    }

    private Food findFoodById(String id) {
        for (Food food : QueryUtils.foods) {
            if (food.getId().equals(id)) {
                return food;
            }
        }
        return null;
    }

    private boolean validateOrder() {
        boolean valid = true;
        String alert = "";
        if (waiterComboBox.getValue() == null) {
            valid = false;
            alert += "Please specify the waiter serving\n";
        }
        if (tableComboBox.getValue() == null) {
            valid = false;
            alert += "Please specify the customers table\n";
        }
        if (orderData.isEmpty()) {
            valid = false;
            alert += "There are no food orders. Please add some\n";
        }
        if (!valid) {
            Alert errorAlert = new Alert(Alert.AlertType.ERROR);
            errorAlert.setContentText("Error placing order:\n" + alert);
            errorAlert.showAndWait();
        }
        return valid;
    }

    public void makeOrder() {
        if (validateOrder()) {
            Alert confirmOrderAlert = new Alert(Alert.AlertType.CONFIRMATION);
            confirmOrderAlert.getButtonTypes().removeAll(confirmOrderAlert.getButtonTypes());
            confirmOrderAlert.getButtonTypes().addAll(ButtonType.YES, ButtonType.NO);
            String orderDetails = "Are you sure you want to place this order placed by " + waiterComboBox.getValue() +
                    " on table " + tableComboBox.getValue() + " with " + orderData.size() + " dishes?";
            confirmOrderAlert.setContentText(orderDetails);
            Optional<ButtonType> result = confirmOrderAlert.showAndWait();

            if (result.get() == ButtonType.YES) {
                Order order = new Order();
                order.setTable(tableComboBox.getValue());
                order.setWaiter(findWaiterByName(waiterComboBox.getValue()));
                order.setAmount(Integer.valueOf(totalLabel.getText()));
                order.setOrderTime(new Date().getTime());
                for (OrderDataModel model : orderData) {
                    Map<Food, Integer> food = new HashMap<>();
                    food.put(findFoodById(model.getDishId()), model.getQuantity());
                    order.getFoods().add(food);
                }
                sendOrder(order);
                resetOrderPane();
                printOrder(order);

                Alert successOrderAlert = new Alert(Alert.AlertType.INFORMATION);
                successOrderAlert.setContentText("Order successfully placed");
                successOrderAlert.showAndWait();
            }
        }
    }

    private Waiter findWaiterByName(String name) {
        for (Waiter waiter : QueryUtils.waiters) {
            if (waiter.getFullName().equals(name)) {
                return waiter;
            }
        }
        return null;
    }

    private void sendOrder(Order order) {
        String data = "{";
        data += "\"table\":\"" + order.getTable() + "\",";
        data += "\"waiter\":\"" + order.getWaiter().getWaiterId() + "\",";
        data += "\"amount\":\"" + order.getAmount() + "\",";
        data += "\"createdDate\":" + order.getOrderTime() + ",";
        data += "\"foods\":[";
        for (Map<Food, Integer> foodsDetails : order.getFoods()) {
            for (Map.Entry<Food, Integer> foodDetails : foodsDetails.entrySet()) {
                data += "{\"food\":\"" + foodDetails.getKey().getId() + "\",\"quantity\":\"" + foodDetails.getValue() + "\"},";
            }
        }
        //To eliminate the last ','
        data = data.substring(0, data.length() - 1);
        data += "]";
        data += "}";

        final String finalData = data;
        ScheduledService<Object> service = new ScheduledService<Object>() {
            @Override
            protected Task<Object> createTask() {
                return new Task<Object>() {
                    @Override
                    protected Object call() throws Exception {
                        ConnectionFactory factory = new ConnectionFactory(finalData, ORDERS_API_URL);
                        return factory.buildConnection();
                    }
                };
            }
        };
        service.setOnSucceeded(e -> {
            if ((boolean) e.getSource().getValue()) {
                statusLabel.setText("Order successfully sent.");
                progressBar.setVisible(false);
                service.cancel();
                orders.add(order);
            } else {
                statusLabel.setText("Error sending data.");
                progressBar.setVisible(false);
                service.cancel();
                pendingOrders.add(order);
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setContentText("Oops!! an error occurred while sending the order data to the server.\n" +
                        "The order will be temporarily saved in pending orders where you can try to resend it.\n" +
                        "The order may however be printed.");
                alert.showAndWait();
            }
        });
        service.setOnRunning(e -> statusLabel.setText("Sending order to server...."));
        service.setOnFailed(e -> statusLabel.setText("Error posting data."));
        progressBar.setVisible(true);
        service.start();
    }

    public void resetOrderPane() {
        orderData.removeAll(orderData);
        ordersTable.setItems(orderData);
        tableComboBox.setValue(null);
        waiterComboBox.setValue(null);
        totalLabel.setText("0");
    }

    private void printOrder(Order order) {
        String separator = "===================================";
        Canvas canvas = new Canvas(300, 600);
        GraphicsContext gc = canvas.getGraphicsContext2D();

//        gc.setFont(Font.font(null, FontWeight.BOLD, 14));
        gc.fillText(separator, 20, 20, 260);
        gc.fillText("Sleek Restaurant Receipt", 90, 40);
        gc.fillText(separator, 20, 60, 260);

        gc.fillText(separator, 20, 80, 260);
        gc.fillText("Dish", 20, 100, 130);
        gc.fillText("price", 150, 100, 40);
        gc.fillText("Quant", 200, 100, 40);
        gc.fillText("Total", 250, 100, 40);
        gc.fillText(separator, 20, 120, 260);

//        gc.setFont(Font.font(null, 14));
        int row = 140;
        for (Map<Food, Integer> foods : order.getFoods()) {
            for (Map.Entry<Food, Integer> entry : foods.entrySet()) {
                int total = entry.getKey().getPrice() * entry.getValue();
                gc.fillText(entry.getKey().getName(), 20, row, 130);
                gc.fillText(String.valueOf(entry.getKey().getPrice()), 150, row, 40);
                gc.fillText(String.valueOf(entry.getValue()), 200, row, 40);
                gc.fillText(String.valueOf(total), 250, row, 40);
            }
            row += 20;
        }

        gc.fillText(separator, 20, row, 260);
        row = row + 20;
        gc.fillText("Total", 20, row, 130);
        gc.fillText(String.valueOf(order.getAmount()), 250, row, 40);
        row = row + 20;
        gc.fillText(separator, 20, row, 260);

        row = row + 30;
        gc.fillText(separator, 20, row, 260);
        row = row + 20;
        gc.fillText("Thanks for shopping with Sleek Restaurant", 40, row);
        row = row + 20;
        gc.fillText(separator, 20, row, 260);


//        Printer printer = Printer.getDefaultPrinter();
//        Paper receipt = PrintHelper.createPaper("receipt", 140, 210, Units.MM);
//        PageLayout pageLayout = printer.createPageLayout(receipt, PageOrientation.PORTRAIT, Printer.MarginType.DEFAULT);
//        double scaleX = pageLayout.getPrintableWidth() / canvas.getBoundsInParent().getWidth();
//        double scaleY = pageLayout.getPrintableHeight() / canvas.getBoundsInParent().getHeight();
//        canvas.getTransforms().add(new Scale(scaleX, scaleY));

        PrinterJob job = PrinterJob.createPrinterJob();
        if (job != null) {
            boolean success = job.printPage(canvas);
            if (success) {
                job.endJob();
            }
        }

    }


    private void showTime() {
        ScheduledService<Object> service = new ScheduledService<Object>() {
            @Override
            protected Task<Object> createTask() {
                return new Task<Object>() {
                    @Override
                    protected Object call() throws Exception {
                        return null;
                    }
                };
            }
        };
        service.setPeriod(Duration.millis(1));
        service.setOnRunning(new EventHandler<WorkerStateEvent>() {
            @Override
            public void handle(WorkerStateEvent event) {
                timeLabel.setText(String.valueOf(LocalDateTime.now()));
            }
        });
        service.start();
    }
}

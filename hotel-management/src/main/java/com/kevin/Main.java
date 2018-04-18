package com.kevin;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.print.*;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.*;
import javafx.scene.transform.Scale;
import javafx.stage.Stage;
import org.fxmisc.cssfx.CSSFX;

import java.util.*;


public class Main extends Application {
    private BorderPane root;
    private HBox rootCenterHBox;
    private VBox rootCenterOrdersVBox;
    private VBox rootCenterPendingOrdersVBox;

    private VBox categoriesVBox;
    private VBox ordersVBox;
    private TilePane itemsTilePane;

    private ScrollPane categoriesScrollPane;
    private ScrollPane ordersScrollPane;
    private ScrollPane itemsScrollPane;

    private TableView ordersTableView;
    private TableColumn deleteColumn;
    private TableColumn decrementColumn;
    private TableColumn itemsColumn;
    private TableColumn priceColumn;
    private TableColumn quantityColumn;
    private TableColumn totalColumn;
    private ObservableList<OrderDataModel> orderData = FXCollections.observableArrayList();

    private ComboBox<Integer> tableComboBox;
    private ComboBox<String> waiterComboBox;
    private Label totalLabel;

    private MenuBar menuBar;
    private Menu workSpaceMenu;
    private Menu ordersMenu;

    public List<Order> orders = new ArrayList<>();
    public List<Order> pendingOrders = new ArrayList<>();

    public static final String WAITERS_API_URL = "http://localhost:3000/api/waiters";
    public static final String ORDERS_API_URL = "http://localhost:3000/api/customerOrder";
    public static final String FOOD_CATEGORIES_API_URL = "http://localhost:3000/api/foodCategories";
    public static final String FOODS_API_URL = "http://localhost:3000/api/foods";
    public static final String IMAGE_URI = "file:///F:/PROJECTS/CLIENT_PROJECTS/hotel-management/src/main/resources/images/breakfast/1.jpeg";


    @Override
    public void start(Stage primaryStage) throws Exception {

        CSSFX.start();

        QueryUtils.setFoodCategories(FOOD_CATEGORIES_API_URL);
        QueryUtils.setFoods(FOODS_API_URL);
        QueryUtils.setWaiters(WAITERS_API_URL);

        root = new BorderPane();
        root.getStyleClass().addAll("imgTilePane");

        rootCenterHBox = new HBox(20);
        rootCenterHBox.setPadding(new Insets(20));
        rootCenterHBox.setAlignment(Pos.TOP_CENTER);

        buildCategoryPane();
        buildOrdersPane();
        buildItemsPane();
        buildMenu();
        buildRootCenterOrdersVBox();
        buildRootCenterPendingOrdersVBox();

        rootCenterHBox.getChildren().addAll(ordersScrollPane, categoriesScrollPane, itemsScrollPane);
        HBox.setHgrow(ordersScrollPane, Priority.ALWAYS);
        HBox.setHgrow(categoriesScrollPane, Priority.NEVER);
        HBox.setHgrow(categoriesScrollPane, Priority.ALWAYS);

        root.setCenter(rootCenterHBox);
        root.setTop(menuBar);
        Scene scene = new Scene(root);
//        scene.getStylesheets().addAll("css/modena_dark.css");
//        scene.getStylesheets().addAll("css/brume.css");
//        scene.getStylesheets().addAll("css/FlatBee.css");
//        scene.getStylesheets().addAll("css/styleComboBox.css");
        scene.getStylesheets().addAll("css/main.css");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void refereshData() {
        QueryUtils.setFoodCategories(FOOD_CATEGORIES_API_URL);
        QueryUtils.setFoods(FOODS_API_URL);
        QueryUtils.setWaiters(WAITERS_API_URL);
        buildCategoryPane();
        buildItemsPane();
    }

    private void buildCategoryPane() {
        categoriesVBox = new VBox();
        categoriesVBox.setAlignment(Pos.TOP_CENTER);
        categoriesVBox.setSpacing(10);
        categoriesVBox.setPadding(new Insets(20));

        categoriesScrollPane = new ScrollPane();

        populateCategoryAndAction();

        categoriesScrollPane.setContent(categoriesVBox);
    }

    private void populateCategoryAndAction() {
        for (FoodCategory category : QueryUtils.foodCategories) {
            Button categoryButton = new Button(category.getName());
            categoryButton.setOnAction(e -> {
                itemsTilePane.getChildren().removeAll(itemsTilePane.getChildren());
                for (Food food : QueryUtils.foods) {
                    if (food.getCategory().equals(category)) {
                        buildOneItem(food);
                    }
                }
            });
            categoryButton.setMaxWidth(Double.MAX_VALUE);
            categoriesVBox.getChildren().add(categoryButton);
        }
    }

    private void buildOrdersPane() {
        ordersVBox = new VBox();
        ordersVBox.setAlignment(Pos.TOP_CENTER);
        ordersVBox.setSpacing(20);
        ordersVBox.setPadding(new Insets(20));

        ordersTableView = new TableView();
        deleteColumn = new TableColumn("Delete");
        decrementColumn = new TableColumn("Decrement");
        itemsColumn = new TableColumn("Dish");
        priceColumn = new TableColumn("Price");
        quantityColumn = new TableColumn("Quantity");
        totalColumn = new TableColumn("Total");
        ordersTableView.getColumns().setAll(deleteColumn, decrementColumn, itemsColumn, priceColumn, quantityColumn, totalColumn);

        deleteColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("delete"));
        decrementColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("decrement"));
        itemsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("dish"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("price"));
        quantityColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("quantity"));
        totalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("total"));

        ordersTableView.setItems(orderData);

        HBox waiterHBox = new HBox(10);
        Label waiterLabel = new Label("Waiter");
        waiterComboBox = new ComboBox<>();
        waiterComboBox.setId("changed");
        ObservableList<String> waiters = FXCollections.observableArrayList();
        for (Waiter waiter : QueryUtils.waiters) {
            waiters.add(waiter.getFullName());
        }
        waiterComboBox.setItems(waiters);
        waiterHBox.getChildren().addAll(waiterLabel, waiterComboBox);

        HBox btnsHBox = new HBox(10);
        Button orderBtn = new Button("Order");
        Button resetBtn = new Button("Reset");
        btnsHBox.getChildren().addAll(orderBtn, resetBtn);

        HBox tableHBox = new HBox(10);
        Label tableLabel = new Label("Table");
        tableComboBox = new ComboBox<>(FXCollections.observableArrayList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
        tableComboBox.setId("changed");
        tableHBox.getChildren().addAll(tableLabel, tableComboBox);

        HBox totalHBox = new HBox(10);
        Label totalLabelTitle = new Label("Total");
        totalLabel = new Label("0");
        totalHBox.getChildren().addAll(totalLabelTitle, totalLabel);

        resetBtn.setOnAction(e -> {
            resetOrderPane();
        });

        orderBtn.setOnAction(e -> {
            makeOrder();
        });

        ordersVBox.getChildren().addAll(ordersTableView, totalHBox, waiterHBox, tableHBox, btnsHBox);

        ordersScrollPane = new ScrollPane();

        ordersScrollPane.setContent(ordersVBox);
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

    private void makeOrder() {
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
                if (sendOrder(order)) {
                    orders.add(order);
                    System.out.println("yess");
                } else {
                    pendingOrders.add(order);
                    System.out.println("Nooo");
                }
                buildRootCenterPendingOrdersVBox();
                buildRootCenterOrdersVBox();
                resetOrderPane();

                printOrder(order);

                Alert successOrderAlert = new Alert(Alert.AlertType.INFORMATION);
                successOrderAlert.setContentText("Order successfully placed");
                successOrderAlert.showAndWait();
            }
        }

    }

    private void buildItemsPane() {
        itemsTilePane = new TilePane();
        itemsTilePane.setAlignment(Pos.TOP_CENTER);
        itemsTilePane.setHgap(10);
        itemsTilePane.setVgap(10);
        itemsTilePane.setPadding(new Insets(20));

        itemsScrollPane = new ScrollPane();
        itemsTilePane.setPrefColumns(3);

        for (Food food : QueryUtils.foods) {
            buildOneItem(food);
        }
        itemsTilePane.getStyleClass().addAll("imgTilePane");
        itemsTilePane.setMaxWidth(Double.MAX_VALUE);
        itemsTilePane.setMaxHeight(Double.MAX_VALUE);
        itemsScrollPane.getStyleClass().addAll("imgTilePane");
        itemsScrollPane.setContent(itemsTilePane);
    }

    private void buildOneItem(Food food) {
        Image image = new Image(IMAGE_URI);
        ImageView imageView = new ImageView(image);
        imageView.setFitHeight(100);
        imageView.setFitWidth(100);
        Button itemButton = new Button(food.getName(), imageView);
        itemButton.getStyleClass().addAll("imgBtn");
        itemButton.setMaxWidth(120);
        itemButton.setWrapText(true);
        itemButton.setUserData(food.getId());
        itemButton.setMaxWidth(Double.MAX_VALUE);
        itemButton.setContentDisplay(ContentDisplay.TOP);
        itemsTilePane.getChildren().add(itemButton);

        itemButton.setOnAction(e -> {
            onSelectFood(itemButton);
        });
    }

    private void onSelectFood(Button itemButton) {
        Food selectedFood = findFoodById((String) itemButton.getUserData());
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
            OrderDataModel dataModel = new OrderDataModel(selectedFood.getName(),
                    selectedFood.getPrice(), 1, selectedFood.getPrice(), selectedFood.getId(),
                    new Button("X"), new Button("--"), null, null, null, null, null);
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
        ordersTableView.setItems(orderData);
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

    private Waiter findWaiterByName(String name) {
        for (Waiter waiter : QueryUtils.waiters) {
            if (waiter.getFullName().equals(name)) {
                return waiter;
            }
        }
        return null;
    }

    private boolean sendOrder(Order order) {
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
        System.out.println(data);

        ConnectionFactory factory = new ConnectionFactory(data, ORDERS_API_URL);
        if (factory.buildConnection()) {
            return true;
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Oops!! an error occurred while sending the order data to the server.\n" +
                    "The order will be temporarily saved in pending orders where you can try to resend it.\n" +
                    "The order may however be printed.");
            alert.showAndWait();
            return false;
        }
    }

    private void resetOrderPane() {
        orderData.removeAll(orderData);
        ordersTableView.setItems(orderData);
        tableComboBox.setValue(null);
        waiterComboBox.setValue(null);
        totalLabel.setText("0");
    }

    private void buildMenu() {
        menuBar = new MenuBar();
        workSpaceMenu = new Menu("Work space");
        ordersMenu = new Menu("Orders");

        MenuItem ordersMenuItem = new MenuItem("All orders");
        ordersMenuItem.setOnAction(e -> {
            root.setCenter(rootCenterOrdersVBox);
        });

        MenuItem pendingOrdersMenuItem = new MenuItem("Pending orders");
        pendingOrdersMenuItem.setOnAction(e -> {
            root.setCenter(rootCenterPendingOrdersVBox);
        });

        ordersMenu.getItems().addAll(ordersMenuItem, pendingOrdersMenuItem);

        MenuItem workspaceMenuItem = new MenuItem("Work space");
        workspaceMenuItem.setOnAction(e -> {
            root.setCenter(rootCenterHBox);
        });

        workSpaceMenu.getItems().addAll(workspaceMenuItem);

        menuBar.getMenus().addAll(workSpaceMenu, ordersMenu);

        workSpaceMenu.setOnAction(e -> {
            root.setCenter(rootCenterHBox);
        });

    }

    private void buildRootCenterOrdersVBox() {
        ObservableList<OrderDataModel> ordersData = FXCollections.observableArrayList();
        rootCenterOrdersVBox = new VBox(20);

        TableView allOrdersTableView = new TableView();
        TableColumn foodsColumn = new TableColumn("Dishes");
        TableColumn grandTotalColumn = new TableColumn("Grand Total");
        TableColumn orderTimeColumn = new TableColumn("Order Time");
        TableColumn waiterColumn = new TableColumn("Waiter");
        allOrdersTableView.getColumns().setAll(foodsColumn, grandTotalColumn, orderTimeColumn, waiterColumn);

        foodsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, Button>("dishes"));
        grandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        orderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));
        waiterColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("waiter"));

        for (Order order : orders) {
            String grandTotal = String.valueOf(order.getAmount());
            String orderTime = new Date(order.getOrderTime()).toString();
            Button dishesBtn = new Button("Dishes");
            String waiter = order.getWaiter().getFullName();
            ordersBtnAction(order, dishesBtn);
            ordersData.add(new OrderDataModel(null, 0, 0, 0, null, null, null,
                    new Button("Resend"), orderTime, grandTotal, dishesBtn, waiter));
        }

        allOrdersTableView.setItems(ordersData);

        rootCenterOrdersVBox.getChildren().addAll(allOrdersTableView);
    }

    private void buildRootCenterPendingOrdersVBox() {
        rootCenterPendingOrdersVBox = new VBox(20);
        ObservableList<OrderDataModel> pendingDataOrders = FXCollections.observableArrayList();

        TableView allPendingOrdersTableView = new TableView();
        TableColumn foodsColumn = new TableColumn("Dishes");
        TableColumn grandTotalColumn = new TableColumn("Grand Total");
        TableColumn orderTimeColumn = new TableColumn("Order Time");
        TableColumn waiterColumn = new TableColumn("Waiter");
        TableColumn resendColumn = new TableColumn("Resend");
        allPendingOrdersTableView.getColumns().setAll(foodsColumn, grandTotalColumn, orderTimeColumn, waiterColumn, resendColumn);

        foodsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, Button>("dishes"));
        grandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        orderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));
        resendColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, Button>("resend"));
        waiterColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("waiter"));

        for (Order order : pendingOrders) {
            String grandTotal = String.valueOf(order.getAmount());
            String orderTime = new Date(order.getOrderTime()).toString();
            Button dishesBtn = new Button("Dishes");
            String waiter = order.getWaiter().getFullName();
            ordersBtnAction(order, dishesBtn);
            pendingDataOrders.add(new OrderDataModel(null, 0, 0, 0, null, null, null,
                    new Button("Resend"), orderTime, grandTotal, dishesBtn, waiter));
        }

        allPendingOrdersTableView.setItems(pendingDataOrders);

        rootCenterPendingOrdersVBox.getChildren().addAll(allPendingOrdersTableView);
    }

    private void ordersBtnAction(Order order, Button dishesBtn) {
        dishesBtn.setOnAction(e -> {
            GridPane gridPane = new GridPane();
            gridPane.setVgap(20);
            gridPane.setHgap(20);
            int row = 0;
            for (Map<Food, Integer> foods : order.getFoods()) {
                for (Map.Entry<Food, Integer> entry : foods.entrySet()) {
                    Label foodLabel = new Label();
                    Label priceLabel = new Label();
                    Label quantityLabel = new Label();
                    Label totalLabel = new Label();
                    foodLabel.setText(entry.getKey().getName());
                    quantityLabel.setText(String.valueOf(entry.getValue()));
                    priceLabel.setText(String.valueOf(entry.getKey().getPrice()));
                    int total = entry.getKey().getPrice() * entry.getValue();
                    totalLabel.setText(String.valueOf(total));
                    gridPane.add(foodLabel, 0, row);
                    gridPane.add(priceLabel, 1, row);
                    gridPane.add(quantityLabel, 2, row);
                    gridPane.add(totalLabel, 3, row);
                }
                row++;
            }
            Dialog dialog = new Dialog();
            dialog.setTitle("Ordered foods");
            dialog.setResizable(true);
            dialog.getDialogPane().setContent(gridPane);
            ButtonType buttonTypeOk = new ButtonType("Got it", ButtonBar.ButtonData.OK_DONE);
            dialog.getDialogPane().getButtonTypes().add(buttonTypeOk);
            dialog.showAndWait();
        });
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

    public static void main(String[] args) {
        launch(args);
    }
}

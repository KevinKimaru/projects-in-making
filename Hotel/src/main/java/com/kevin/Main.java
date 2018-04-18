package com.kevin;

import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.time.LocalDateTime;
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


    @Override
    public void start(Stage primaryStage) throws Exception {
        QueryUtils.setFoodCategories("http://localhost:3000/api/foodCategories");
        QueryUtils.setFoods("http://localhost:3000/api/foods");
        QueryUtils.setWaiters("http://localhost:3000/api/waiters");

        root = new BorderPane();

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
//        scene.getStylesheets().add();
        primaryStage.setScene(scene);
        primaryStage.show();
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
        for (com.kevin.FoodCategory category : QueryUtils.foodCategories) {
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

        populateOrderTable();

        HBox waiterHBox = new HBox(10);
        Label waiterLabel = new Label("Waiter");
        waiterComboBox = new ComboBox<>();
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
                orders.add(order);
                sendOrder(order);

                Alert successOrderAlert = new Alert(Alert.AlertType.INFORMATION);
                successOrderAlert.setContentText("Order successfully placed");
                successOrderAlert.showAndWait();
            }
        }

    }

    private void populateOrderTable() {
        deleteColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("delete"));
        decrementColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("decrement"));
        itemsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("dish"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("price"));
        quantityColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("quantity"));
        totalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("total"));

        ordersTableView.setItems(orderData);
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

        itemsScrollPane.setContent(itemsTilePane);
    }

    private void buildOneItem(Food food) {
        Image image = new Image("file:///F:/PROJECTS/CLIENT_PROJECTS/Hotel/src/breakfast/1.jpeg");
        ImageView imageView = new ImageView(image);
        imageView.setFitHeight(100);
        imageView.setFitWidth(100);
        Button itemButton = new Button(food.getName(), imageView);
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
                    new Button("X"), new Button("--"), null, null, null);
            dataModel.getDelete().setOnAction(e -> {
                orderData.remove(dataModel);
                calaculateTotal();
            });
            dataModel.getDecrement().setOnAction(e -> {
                if(dataModel.getQuantity() == 1) {
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

    private void sendOrder(Order order) {
        String data = "{";
        data += "\"table\":\"" + order.getTable() + "\",";
        data += "\"waiter\":\"" + order.getWaiter().getWaiterId() + "\",";
        data += "\"amount\":\"" + order.getAmount() + "\",";
        data += "\"createdDate\":" + order.getOrderTime() + ",";
        data += "\"foods\":[";
        for (Map<Food, Integer> foodsDetails: order.getFoods()) {
            for (Map.Entry<Food, Integer> foodDetails: foodsDetails.entrySet()) {
                data += "{\"food\":\"" +  foodDetails.getKey().getId() + "\",\"quantity\":\"" + foodDetails.getValue() + "\"},";
            }
        }
        //To eliminate the last ','
        data = data.substring(0, data.length()-1);
        data += "]";
        data += "}";
        System.out.println(data);

        ConnectionFactory factory = new ConnectionFactory(data, "http://localhost:3000/api/customerOrder");
        System.out.println(factory.buildConnection());
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
        rootCenterOrdersVBox = new VBox(20);

        TableView allOrdersTableView = new TableView();
        TableColumn foodsColumn = new TableColumn("Dishes");
        TableColumn foodColumn = new TableColumn("Dish");
        TableColumn priceColumn = new TableColumn("Price");
        TableColumn quantityColumn = new TableColumn("Quantity");
        TableColumn totalColumn = new TableColumn("Total");
        TableColumn grandTotalColumn = new TableColumn("Grand Total");
        TableColumn orderTimeColumn = new TableColumn("Order Time");
        foodsColumn.getColumns().addAll(foodColumn, priceColumn, quantityColumn, totalColumn);
        allOrdersTableView.getColumns().setAll(foodsColumn, grandTotalColumn, orderTimeColumn);

        foodColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("dish"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("price"));
        quantityColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("quantity"));
        totalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("total"));
        grandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        orderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));

        for (Order order: orders) {
            String grandTotal = String.valueOf(order.getAmount());
            String orderTime = new Date(order.getOrderTime()).toString();
            for(Map<Food, Integer> foods: order.getFoods()) {
                for(Map.Entry<Food, Integer> entry: foods.entrySet()) {

                }
            }
        }

        ObservableList<OrderDataModel> orderData = FXCollections.observableArrayList();
        ordersTableView.setItems(orderData);

        rootCenterOrdersVBox.getChildren().addAll(allOrdersTableView);
    }

    private void buildRootCenterPendingOrdersVBox() {
        rootCenterPendingOrdersVBox = new VBox(20);

        TableView allPendingOrdersTableView = new TableView();
        TableColumn foodsColumn = new TableColumn("Dishes");
        TableColumn grandTotalColumn = new TableColumn("Grand Total");
        TableColumn orderTimeColumn = new TableColumn("Order Time");
        TableColumn resendColumn = new TableColumn("Resend");
        allPendingOrdersTableView.getColumns().setAll(foodsColumn, grandTotalColumn, orderTimeColumn);

        foodsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, Button>("dishes"));
        grandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        orderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));
        resendColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, Button>("resend"));

        ObservableList<OrderDataModel> orderData = FXCollections.observableArrayList();
        allPendingOrdersTableView.setItems(orderData);

        rootCenterPendingOrdersVBox.getChildren().addAll(allPendingOrdersTableView);
    }

    public static void main(String[] args) {
        launch(args);
    }
}

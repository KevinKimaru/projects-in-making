package com.kevin;

import com.jfoenix.controls.JFXButton;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;

import java.util.Date;
import java.util.Map;

/**
 * Created by Kevin Kimaru Chege on 3/10/2018.
 */
public class OrdersController {

    @FXML
    TableColumn foodsColumn;
    @FXML
    TableColumn grandTotalColumn;
    @FXML
    TableColumn orderTimeColumn;
    @FXML
    TableColumn waiterColumn;

    @FXML
    TableColumn pfoodsColumn;
    @FXML
    TableColumn pgrandTotalColumn;
    @FXML
    TableColumn porderTimeColumn;
    @FXML
    TableColumn pwaiterColumn;
    @FXML
    TableColumn presendColumn;

    @FXML
    TableView ordersTable;
    @FXML
    TableView pendingOrdersTable;

    public void refreshOrders() {
        System.out.println("Am here.....");
        setReadyOrdersTable();
        setReadyPendingOrdersTable();
        populateOrdersTable();
        populatePendingOrdersTable();
    }

    private void populateOrdersTable() {
        System.out.println("populating......");
        ObservableList<OrderDataModel> ordersData = FXCollections.observableArrayList();
        HomeController hc = new HomeController();
        System.out.println(hc.getOrders());
        for (Order order: hc.getOrders()) {
            String grandTotal = String.valueOf(order.getAmount());
            String orderTime = new Date(order.getOrderTime()).toString();
            JFXButton dishesBtn = new JFXButton("Dishes");
            String waiter = order.getWaiter().getFullName();
            ordersBtnAction(order, dishesBtn);
            ordersData.add(new OrderDataModel(null, 0, 0,0,null, null, null,
                    null, orderTime, grandTotal, dishesBtn, waiter));
        }

        ordersTable.setItems(ordersData);
    }

    private void populatePendingOrdersTable() {
        ObservableList<OrderDataModel> pendingDataOrders = FXCollections.observableArrayList();
        for (Order order: new HomeController().getPendingOrders()) {
            String grandTotal = String.valueOf(order.getAmount());
            String orderTime = new Date(order.getOrderTime()).toString();
            JFXButton dishesBtn = new JFXButton("Dishes");
            String waiter = order.getWaiter().getFullName();
            ordersBtnAction(order, dishesBtn);
            pendingDataOrders.add(new OrderDataModel(null, 0, 0,0,null, null, null,
                    new JFXButton("Resend"), orderTime, grandTotal, dishesBtn, waiter));
        }

        pendingOrdersTable.setItems(pendingDataOrders);
    }

    private void ordersBtnAction(Order order, Button dishesBtn) {
        dishesBtn.setOnAction(e -> {
            GridPane gridPane = new GridPane();
            gridPane.setVgap(20);
            gridPane.setHgap(20);
            int row = 0;
            for(Map<Food, Integer> foods: order.getFoods()) {
                for(Map.Entry<Food, Integer> entry: foods.entrySet()) {
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


    private void setReadyOrdersTable() {
        System.out.println("setting ready.......");
        foodsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, JFXButton>("dishes"));
        grandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        orderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));
        waiterColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("waiter"));
    }

    private void setReadyPendingOrdersTable() {
        pfoodsColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, JFXButton>("dishes"));
        pgrandTotalColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("grandTotal"));
        porderTimeColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("orderTime"));
        pwaiterColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, String>("waiter"));
        presendColumn.setCellValueFactory(new PropertyValueFactory<OrderDataModel, JFXButton>("resend"));
    }
}

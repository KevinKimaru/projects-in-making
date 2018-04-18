package com.kevin;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.scene.control.Button;

/**
 * Created by Kevin Kimaru Chege on 3/3/2018.
 */
public class OrderDataModel {
    private SimpleStringProperty dish;
    private SimpleIntegerProperty price;
    private SimpleIntegerProperty quantity;
    private SimpleIntegerProperty total;
    private SimpleStringProperty dishId;
    private Button delete;
    private Button decrement;
    private Button resend;
    private Button dishes;
    private SimpleStringProperty orderTime;
    private SimpleStringProperty grandTotal;
    private SimpleStringProperty waiter;

    public OrderDataModel(String dish, int price, int quantity, int total,
                          String dishId, Button delete, Button decrement, Button resend, String orderTime, String grandTotal,
                          Button dishes, String waiter) {
        this.dish = new SimpleStringProperty(dish);
        this.price = new SimpleIntegerProperty(price);
        this.quantity = new SimpleIntegerProperty(quantity);
        this.total = new SimpleIntegerProperty(total);
        this.dishId = new SimpleStringProperty(dishId);
        this.delete = delete;
        this.decrement = decrement;
        this.resend = resend;
        this.orderTime = new SimpleStringProperty(orderTime);
        this.grandTotal = new SimpleStringProperty(grandTotal);
        this.dishes = dishes;
        this.waiter = new SimpleStringProperty(waiter);
    }

    public String getDish() {
        return dish.get();
    }

    public SimpleStringProperty dishProperty() {
        return dish;
    }

    public void setDish(String dish) {
        this.dish.set(dish);
    }

    public int getPrice() {
        return price.get();
    }

    public void setPrice(int price) {
        this.price.set(price);
    }

    public int getQuantity() {
        return quantity.get();
    }


    public void setQuantity(int quantity) {
        this.quantity.set(quantity);
    }

    public int getTotal() {
        return total.get();
    }

    public void setTotal(int total) {
        this.total.set(total);
    }

    public String getDishId() {
        return dishId.get();
    }

    public void setDishId(String dishId) {
        this.dishId.set(dishId);
    }

    public Button getDelete() {
        return delete;
    }

    public void setDelete(Button delete) {
        this.delete = delete;
    }

    public Button getDecrement() {
        return decrement;
    }

    public void setDecrement(Button decrement) {
        this.decrement = decrement;
    }

    public Button getResend() {
        return resend;
    }

    public void setResend(Button resend) {
        this.resend = resend;
    }

    public String getOrderTime() {
        return orderTime.get();
    }

    public void setOrderTime(String orderTime) {
        this.orderTime.set(orderTime);
    }

    public String getGrandTotal() {
        return grandTotal.get();
    }

    public void setGrandTotal(String grandTotal) {
        this.grandTotal.set(grandTotal);
    }

    public Button getDishes() {
        return dishes;
    }

    public void setDishes(Button dishes) {
        this.dishes = dishes;
    }

    public String getWaiter() {
        return waiter.get();
    }

    public void setWaiter(String waiter) {
        this.waiter.set(waiter);
    }
}

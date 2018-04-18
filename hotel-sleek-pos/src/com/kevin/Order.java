package com.kevin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Kevin Kimaru Chege on 3/3/2018.
 */
public class Order {
    private int table;
    private Waiter waiter;
    private int amount;
    private List<Map<Food, Integer>> foods;
    private long orderTime;

    public Order() {
        foods = new ArrayList<>();
    }

    public int getTable() {
        return table;
    }

    public void setTable(int table) {
        this.table = table;
    }

    public Waiter getWaiter() {
        return waiter;
    }

    public void setWaiter(Waiter waiter) {
        this.waiter = waiter;
    }

    public List<Map<Food, Integer>> getFoods() {
        return foods;
    }

    public void setFoods(List<Map<Food, Integer>> foods) {
        this.foods = foods;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public long getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(long orderTime) {
        this.orderTime = orderTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Order order = (Order) o;

        if (table != order.table) return false;
        if (amount != order.amount) return false;
        if (orderTime != order.orderTime) return false;
        if (waiter != null ? !waiter.equals(order.waiter) : order.waiter != null) return false;
        return foods != null ? foods.equals(order.foods) : order.foods == null;
    }

    @Override
    public int hashCode() {
        int result = table;
        result = 31 * result + (waiter != null ? waiter.hashCode() : 0);
        result = 31 * result + amount;
        result = 31 * result + (foods != null ? foods.hashCode() : 0);
        result = 31 * result + (int) (orderTime ^ (orderTime >>> 32));
        return result;
    }
}

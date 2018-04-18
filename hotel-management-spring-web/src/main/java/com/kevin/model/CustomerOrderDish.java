package com.kevin.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.Map;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class CustomerOrderDish {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final Long id;
    @NotNull
    private Map<Dish, Integer> dish;
    @NotNull
    private int price;

    protected CustomerOrderDish() {
        id = null;
    }

    public CustomerOrderDish(Map<Dish, Integer> dish, int price) {
        this();
        this.dish = dish;
        this.price = price;
    }

    public Map<Dish, Integer> getDish() {
        return dish;
    }

    public void setDish(Map<Dish, Integer> dish) {
        this.dish = dish;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class DishCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    @Size(min = 2, max= 50)
    private String name;
    private String description;
    @OneToMany(mappedBy = "dishCategory", cascade = CascadeType.ALL)
    private List<Dish> dishes;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected DishCategory() {
        id = null;
        dateAdded = new Date();
        lastModifiedDate = new Date();
        dishes = new ArrayList<>();
    }

    public DishCategory(String name, String description, Date dateAdded, Date lastModifiedDate) {
        this();
        this.name = name;
        this.description = description;
        this.dateAdded = dateAdded;
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Dish> getDishes() {
        return dishes;
    }

    public void addDish(Dish dish) {
        dish.setDishCategory(this);
        this.dishes.add(dish);
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}

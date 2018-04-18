package com.kevin;

/**
 * Created by Kevin Kimaru Chege on 3/3/2018.
 */
public class Food {
    private String id;
    private String name;
    private int price;
    private FoodCategory category;

    public Food(String id, String name, int price, FoodCategory category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public FoodCategory getCategory() {
        return category;
    }

    public void setCategory(FoodCategory category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Food food = (Food) o;

        if (price != food.price) return false;
        if (id != null ? !id.equals(food.id) : food.id != null) return false;
        if (name != null ? !name.equals(food.name) : food.name != null) return false;
        return category != null ? category.equals(food.category) : food.category == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + price;
        result = 31 * result + (category != null ? category.hashCode() : 0);
        return result;
    }
}

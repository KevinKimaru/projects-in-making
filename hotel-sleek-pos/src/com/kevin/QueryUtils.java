package com.kevin;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kevin Kimaru Chege on 3/3/2018.
 */
public class QueryUtils {

    public static List<Food> foods = null;
    public static List<FoodCategory> foodCategories = null;
    public static List<Waiter> waiters = null;

    public static void setFoods(String requestUrl) throws ParseException, IOException {
        // Create URL object
        URL url = createUrl(requestUrl);

        // Perform HTTP request to the URL and receive a JSON response back
        String jsonResponse = null;

        jsonResponse = makeHttpRequest(url);

        // Extract relevant fields from the JSON response and create an {@link Event} object
        foods = extractFoods(jsonResponse);
    }

    public static void setFoodCategories(String requestUrl) throws IOException, ParseException {
        // Create URL object
        URL url = createUrl(requestUrl);

        // Perform HTTP request to the URL and receive a JSON response back
        String jsonResponse = null;
        jsonResponse = makeHttpRequest(url);


        // Extract relevant fields from the JSON response and create an {@link Event} object
        foodCategories = extractFoodCategories(jsonResponse);
    }

    public static void setWaiters(String requestUrl) throws IOException, ParseException {
        // Create URL object
        URL url = createUrl(requestUrl);

        // Perform HTTP request to the URL and receive a JSON response back
        String jsonResponse = null;

        jsonResponse = makeHttpRequest(url);


        // Extract relevant fields from the JSON response and create an {@link Event} object
        waiters = extractWaiters(jsonResponse);
    }

    private static URL createUrl(String stringUrl) throws MalformedURLException {
        URL url = null;

        url = new URL(stringUrl);

        return url;
    }

    private static String makeHttpRequest(URL url) throws IOException {
        String jsonResponse = "";

        // If the URL is null, then return early.
        if (url == null) {
            return jsonResponse;
        }

        HttpURLConnection urlConnection = null;
        InputStream inputStream = null;

        urlConnection = (HttpURLConnection) url.openConnection();
//            urlConnection.setReadTimeout(10000 /* milliseconds */);
//            urlConnection.setConnectTimeout(15000 /* milliseconds */);
        urlConnection.setRequestMethod("GET");
        urlConnection.connect();

        // If the request was successful (response code 200),
        // then read the input stream and parse the response.
        if (urlConnection.getResponseCode() == 200) {
            inputStream = urlConnection.getInputStream();
            jsonResponse = readFromStream(inputStream);
        } else {
            System.out.println("500 error");
        }

        if (urlConnection != null) {
            urlConnection.disconnect();
        }
        if (inputStream != null) {
            inputStream.close();
        }

        return jsonResponse;
    }

    private static String readFromStream(InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();
        if (inputStream != null) {
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, Charset.forName("UTF-8"));
            BufferedReader reader = new BufferedReader(inputStreamReader);
            String line = reader.readLine();
            while (line != null) {
                output.append(line);
                line = reader.readLine();
            }
        }
        return output.toString();
    }


    private static List<Food> extractFoods(String foodsJSON) throws ParseException {

        // Create an empty ArrayList that we can start adding foods to
        List<Food> foods = new ArrayList<>();

        // If the JSON string is empty or null, then return early.
        if (foodsJSON.isEmpty()) {
            return null;
        }

        JSONParser parser = new JSONParser();

        JSONArray foodsArray = (JSONArray) parser.parse(foodsJSON);

        for (int i = 0; i < foodsArray.size(); i++) {
            JSONObject currentFood = (JSONObject) foodsArray.get(i);
            String foodId = (String) currentFood.get("foodId");
            String name = (String) currentFood.get("name");
            String price = (String) currentFood.get("price");
            JSONObject category = (JSONObject) currentFood.get("category");
            String categoryId = (String) category.get("_id");
            String categoryName = (String) category.get("name");
            FoodCategory foodCategory = new FoodCategory(categoryId, categoryName);
            Food food = new Food(foodId, name, Integer.valueOf(price), foodCategory);
            foods.add(food);
        }


        // Return the list of foods
        return foods;
    }

    private static List<FoodCategory> extractFoodCategories(String foodCategoriesJson) throws ParseException {

        // Create an empty ArrayList that we can start adding foods to
        List<FoodCategory> foodCategories = new ArrayList<>();

        // If the JSON string is empty or null, then return early.
        if (foodCategoriesJson.isEmpty()) {
            return null;
        }
        JSONParser parser = new JSONParser();

        JSONArray foodsArray = (JSONArray) parser.parse(foodCategoriesJson);

        for (int i = 0; i < foodsArray.size(); i++) {
            JSONObject currentFoodCategory = (JSONObject) foodsArray.get(i);
            String foodCategoryId = (String) currentFoodCategory.get("foodCategoryId");
            String name = (String) currentFoodCategory.get("name");
            String description = (String) currentFoodCategory.get("description");
            FoodCategory foodCategory = new FoodCategory(foodCategoryId, name);
            foodCategories.add(foodCategory);
        }


        // Return the list of foods
        return foodCategories;
    }

    private static List<Waiter> extractWaiters(String waitersJson) throws ParseException {

        List<Waiter> waiters = new ArrayList<>();

        // If the JSON string is empty or null, then return early.
        if (waitersJson.isEmpty()) {
            return null;
        }

        JSONParser parser = new JSONParser();

        JSONArray foodsArray = (JSONArray) parser.parse(waitersJson);

        for (int i = 0; i < foodsArray.size(); i++) {
            JSONObject currentWaiter = (JSONObject) foodsArray.get(i);
            String waiterId = (String) currentWaiter.get("waiterId");
            String name = (String) currentWaiter.get("name");
            Waiter waiter = new Waiter(waiterId, name);
            waiters.add(waiter);
        }


        // Return the list of foods
        return waiters;
    }

}

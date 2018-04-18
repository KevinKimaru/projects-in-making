package com.kevin;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kevin Kimaru Chege on 3/4/2018.
 */
public class ConnectionFactory {
    private String API = "";

    private String METHOD = "POST";
    private String TYPE = "application/json;charset=UTF-8";
    private String data = "";
    private URL connection;
    private HttpURLConnection finalConnection;


    public ConnectionFactory(String data, String API) {
        this.API = API;
        this.data = data;
    }

    public String buildConnection() {
        StringBuilder content = new StringBuilder();
        if(!this.getData().isEmpty() && !this.getData().equalsIgnoreCase("")) {
            try {
                connection = new URL(API);
                BufferedReader  reader = new BufferedReader(new InputStreamReader(readWithAccess(connection, data)));
                String line;
                while((line = reader.readLine()) != null) {
                    content.append(line + "\n");
                }
                reader.close();
                return content.toString();
            } catch(Exception e) {
                e.printStackTrace();
            }
        } else {
            return null;
        }
        return null;
    }

    private InputStream  readWithAccess(URL url, String data) {
        try {
            byte[] out = data.getBytes();
            finalConnection = (HttpURLConnection) url.openConnection();
            finalConnection.setRequestMethod(METHOD);
            finalConnection.setDoOutput(true);
            finalConnection.setRequestProperty("Content-Type", TYPE);
            finalConnection.connect();
            try {
                OutputStream os = finalConnection.getOutputStream();
                os.write(out);
            } catch(Exception e) {
                e.printStackTrace();
            }
            return finalConnection.getInputStream();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void setMETHOD(String METHOD) {
        this.METHOD = METHOD;
    }

    public void setTYPE(String TYPE) {
        this.TYPE = TYPE;
    }

    public String getData() {
        return data;
    }
}

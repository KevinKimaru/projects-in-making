package com.kevin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    @Size(min = 2, max = 50)
    private String firstName;
    @NotNull
    @Size(min = 2, max = 50)
    private String lastName;
    @NotNull
    @Size(min = 2, max = 50)
    private String idNumber;
    @NotNull
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,6}$")
    private String email;
    @NotNull
    @Size(min = 10, max = 10)
    private String phoneNumber;
    @NotNull
    @Size(min = 1, max = 50)
    private String address;
    @NotNull
    @Size(min = 10, max = 50)
    private String addressCode;
    @NotNull
    @Size(min = 2, max = 50)
    private String city;
    @OneToOne(cascade = CascadeType.ALL)
    @NotNull
    private Account account;
    @NotNull
    @Size(min = 2, max = 50)
    private String position;
    @NotNull
    private int status;
    @JsonIgnore
    @NotNull
    private String[] roles;
    @OneToMany(mappedBy = "waiter", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<CustomerOrder> customerOrders;
    @OneToMany(mappedBy = "employee", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Salary> salaries;
    @NotNull
    @Temporal(TemporalType.TIME)
    private Date  dateOfReg;
    @NotNull
    @Temporal(TemporalType.TIME)
    private Date lastModifiedDate;

    protected Employee() {
        id = null;
        dateOfReg = new Date();
        lastModifiedDate = new Date();
        status = 1;
        customerOrders = new ArrayList<>();
        salaries = new ArrayList<>();
    }

    public Employee(String firstName, String lastName, String idNumber, String email, String phoneNumber,
                    String address, String addressCode, String city, String position, String[] roles, Account account) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.idNumber = idNumber;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.addressCode = addressCode;
        this.city = city;
        this.position = position;
        this.roles = roles;
        this.account = account;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressCode() {
        return addressCode;
    }

    public void setAddressCode(String addressCode) {
        this.addressCode = addressCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    public Date getDateOfReg() {
        return dateOfReg;
    }

    public void setDateOfReg(Date dateOfReg) {
        this.dateOfReg = dateOfReg;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public List<CustomerOrder> getCustomerOrders() {
        return customerOrders;
    }

    public void setCustomerOrders(List<CustomerOrder> customerOrders) {
        this.customerOrders = customerOrders;
    }
}

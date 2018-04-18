package com.kevin.model;

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
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    @Size(min = 2, max = 50)
    private String companyName;
    @NotNull
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,6}$")
    private String email;
    @NotNull
    @Size(min = 10, max = 10)
    private String phoneNumber;
    @NotNull
    @Size(min = 2, max = 50)
    private String address;
    @NotNull
    @Size(min = 2, max = 50)
    private String addressCode;
    @NotNull
    @Size(min = 2, max = 50)
    private String city;
    @OneToOne(cascade = CascadeType.ALL)
    @NotNull
    private Account account;
    @OneToMany(mappedBy = "supplier", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Credit> credits;
    @OneToMany(mappedBy = "supplier", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<StoreIn> storeIns;
    @NotNull
    private int status;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateOfReg;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    public Supplier() {
        id = null;
        dateOfReg = new Date();
        lastModifiedDate = new Date();
        this.status = 1;
        credits = new ArrayList<>();
        storeIns = new ArrayList<>();
    }

    public Supplier(String companyName, String email, String phoneNumber, String address,
                    String addressCode, String city, Account account) {
        this();
        this.companyName = companyName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.addressCode = addressCode;
        this.city = city;
        this.account = account;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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

    public List<Credit> getCredits() {
        return credits;
    }

    public void addCredit(Credit credit) {
        credit.setSupplier(this);
        this.credits.add(credit);
    }

    public void setCredits(List<Credit> credits) {
        this.credits = credits;
    }

    public List<StoreIn> getStoreIns() {
        return storeIns;
    }

    public void setStoreIns(List<StoreIn> storeIns) {
        this.storeIns = storeIns;
    }
}

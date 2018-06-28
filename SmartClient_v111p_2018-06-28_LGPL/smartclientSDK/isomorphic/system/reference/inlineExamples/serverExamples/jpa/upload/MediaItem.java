/*
 * Isomorphic SmartClient web presentation layer
 * Copyright 2000 and beyond Isomorphic Software, Inc.
 *
 * OWNERSHIP NOTICE
 * Isomorphic Software owns and reserves all rights not expressly granted in this source code,
 * including all intellectual property rights to the structure, sequence, and format of this code
 * and to all designs, interfaces, algorithms, schema, protocols, and inventions expressed herein.
 *
 *  If you have any questions, please email <sourcecode@isomorphic.com>.
 *
 *  This entire comment must accompany any portion of Isomorphic Software source code that is
 *  copied or moved from this file.
 */

package com.isomorphic.examples.server.jpa.upload;

import java.sql.Blob;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table (name="mediaLibraryHB")
public class MediaItem {

    private int pk;
    private String title;
    private byte[] image;  // This can also be a Byte[] but NOT an InputStream 
    private String image_filename;
    private int image_filesize;
    private Date image_date_created;

    @Id
    @Column (nullable = false)
    @GeneratedValue (strategy = GenerationType.AUTO)
    public int getPk() {
        return pk;
    }
    public void setPk(int pk) {
        this.pk = pk;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    
    @Lob
    public byte[] getImage() {
        return image;
    }
    public void setImage(byte[] image) {
        this.image = image;
    }
    public String getImage_filename() {
        return image_filename;
    }
    public void setImage_filename(String image_filename) {
        this.image_filename = image_filename;
    }
    public int getImage_filesize() {
        return image_filesize;
    }
    public void setImage_filesize(int image_filesize) {
        this.image_filesize = image_filesize;
    }
    public Date getImage_date_created() {
        return image_date_created;
    }
    public void setImage_date_created(Date image_date_created) {
        this.image_date_created = image_date_created;
    }
    
}

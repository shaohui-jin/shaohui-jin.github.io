---
title: Java 工具类
lang: zh-CN
date: 2023-02-24 15:34:43
permalink: /Java/Utils/
category:
- Java
tag:
- Java
---

## 加解密

### AES加解密

```java
public static void main(String[] args) throws Exception {
   DeshfuUtil desUtil = new DeshfuUtil();
   System.out.println("加密:"+encrypt("abcdef")
         .toUpperCase());
   System.out.println("解密:"+decrypt("7E91EA4F56943F90"));
}
```

```java
public class DeshfuUtil {
   private static final String PASSWORD_CRYPT_KEY = "TOGETHER!@#$%";
   // 解密数据
   public static String decrypt(String message) throws Exception {

      byte[] bytesrc = convertHexString(message);
      Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
      DESKeySpec desKeySpec = new DESKeySpec(JavaMD5.getMD5ofStr(PASSWORD_CRYPT_KEY)
            .substring(0, 8).getBytes("UTF-8"));
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
      SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
      IvParameterSpec iv = new IvParameterSpec(JavaMD5.getMD5ofStr(PASSWORD_CRYPT_KEY)
            .substring(0, 8).getBytes("UTF-8"));
      cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
      byte[] retByte = cipher.doFinal(bytesrc);
      return new String(retByte);
   }

   public static String encrypt(String message) throws Exception {
      Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
      DESKeySpec desKeySpec = new DESKeySpec(JavaMD5.getMD5ofStr(PASSWORD_CRYPT_KEY)
            .substring(0, 8).getBytes("UTF-8"));
      SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
      SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
      IvParameterSpec iv = new IvParameterSpec(JavaMD5.getMD5ofStr(PASSWORD_CRYPT_KEY)
            .substring(0, 8).getBytes("UTF-8"));
      cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
      return toHexString(cipher.doFinal(message.getBytes("UTF-8")));
   }

   public static byte[] convertHexString(String ss) {
      byte digest[] = new byte[ss.length() / 2];
      for (int i = 0; i < digest.length; i++) {
         String byteString = ss.substring(2 * i, 2 * i + 2);
         int byteValue = Integer.parseInt(byteString, 16);
         digest[i] = (byte) byteValue;
      }
      return digest;
   }

   public static String toHexString(byte b[]) {
      StringBuffer hexString = new StringBuffer();
      for (int i = 0; i < b.length; i++) {
         String plainText = Integer.toHexString(0xff & b[i]);
         if (plainText.length() < 2)
            plainText = "0" + plainText;
         hexString.append(plainText);
      }
      return hexString.toString();
   }
}
```

### RSA加解密

```java
public static void main(String[] args) {
    try {
        // 生成密钥对
        KeyPair keyPair = getKeyPair();
        String privateKey = new String(Base64.encodeBase64(keyPair.getPrivate().getEncoded()));
        String publicKey = new String(Base64.encodeBase64(keyPair.getPublic().getEncoded()));
        System.out.println("私钥:" + privateKey);
        System.out.println("公钥:" + publicKey);
        // RSA加密 待加密的文字内容
        String data = "123456";
        String encryptData = encrypt(data, getPublicKey(publicKey));
        System.out.println("加密前内容:" + data);
        System.out.println("加密后内容:" + encryptData);
        // RSA解密
        String decryptData = decrypt(encryptData, getPrivateKey(privateKey));
        System.out.println("解密后内容:" + decryptData);

        // RSA签名
        String sign = sign(data, getPrivateKey(privateKey));
        // RSA验签
        boolean result = verify(data, getPublicKey(publicKey), sign);
        System.out.print("验签结果:" + result);
    } catch (Exception e) {
        e.printStackTrace();
        System.out.print("加解密异常");
    }
}
```

```java
import java.io.ByteArrayOutputStream;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import javax.crypto.Cipher;
import org.apache.commons.codec.binary.Base64;

public class RSAUtil {

    /**
     * RSA最大加密明文大小
     */
    private static final int MAX_ENCRYPT_BLOCK = 64;

    /**
     * RSA最大解密密文大小
     */
    private static final int MAX_DECRYPT_BLOCK = 75;

    /**
     * 获取密钥对
     *
     * @return 密钥对
     */
    public static KeyPair getKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(512);
        return generator.generateKeyPair();
    }

    /**
     * 获取私钥
     *
     * @param privateKey 私钥字符串
     * @return
     */
    public static PrivateKey getPrivateKey(String privateKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        byte[] decodedKey = Base64.decodeBase64(privateKey.getBytes());
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
        return keyFactory.generatePrivate(keySpec);
    }

    /**
     * 获取公钥
     *
     * @param publicKey 公钥字符串
     * @return
     */
    public static PublicKey getPublicKey(String publicKey) throws Exception {
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        byte[] decodedKey = Base64.decodeBase64(publicKey.getBytes());
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);
        return keyFactory.generatePublic(keySpec);
    }

    /**
     * RSA加密
     *
     * @param data 待加密数据
     * @param publicKey 公钥
     * @return
     */
    public static String encrypt(String data, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        int inputLen = data.getBytes().length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offset = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段加密
        while (inputLen - offset > 0) {
            if (inputLen - offset > MAX_ENCRYPT_BLOCK) {
                cache = cipher.doFinal(data.getBytes(), offset, MAX_ENCRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(data.getBytes(), offset, inputLen - offset);
            }
            out.write(cache, 0, cache.length);
            i++;
            offset = i * MAX_ENCRYPT_BLOCK;
        }
        byte[] encryptedData = out.toByteArray();
        out.close();
        // 获取加密内容使用base64进行编码,并以UTF-8为标准转化成字符串
        // 加密后的字符串
        return new String(Base64.encodeBase64String(encryptedData));
    }

    /**
     * RSA解密
     *
     * @param data 待解密数据
     * @param privateKey 私钥
     * @return
     */
    public static String decrypt(String data, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] dataBytes = Base64.decodeBase64(data);
        int inputLen = dataBytes.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offset = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段解密
        while (inputLen - offset > 0) {
            if (inputLen - offset > MAX_DECRYPT_BLOCK) {
                cache = cipher.doFinal(dataBytes, offset, MAX_DECRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(dataBytes, offset, inputLen - offset);
            }
            out.write(cache, 0, cache.length);
            i++;
            offset = i * MAX_DECRYPT_BLOCK;
        }
        byte[] decryptedData = out.toByteArray();
        out.close();
        // 解密后的内容
        return new String(decryptedData, "UTF-8");
    }

    /**
     * 签名
     *
     * @param data 待签名数据
     * @param privateKey 私钥
     * @return 签名
     */
    public static String sign(String data, PrivateKey privateKey) throws Exception {
        byte[] keyBytes = privateKey.getEncoded();
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PrivateKey key = keyFactory.generatePrivate(keySpec);
        Signature signature = Signature.getInstance("MD5withRSA");
        signature.initSign(key);
        signature.update(data.getBytes());
        return new String(Base64.encodeBase64(signature.sign()));
    }

    /**
     * 验签
     *
     * @param srcData 原始字符串
     * @param publicKey 公钥
     * @param sign 签名
     * @return 是否验签通过
     */
    public static boolean verify(String srcData, PublicKey publicKey, String sign) throws Exception {
        byte[] keyBytes = publicKey.getEncoded();
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey key = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance("MD5withRSA");
        signature.initVerify(key);
        signature.update(srcData.getBytes());
        return signature.verify(Base64.decodeBase64(sign.getBytes()));
    }
}
```

## 文件

### 文件上传下载

```java
public class ResultEntity {
    private boolean suceesss;
    private String code;
    private String msg;
    public ResultEntity(boolean suceesss, String code, String msg) {
        this.suceesss = suceesss;
        this.code = code;
        this.msg = msg;
    }
    public boolean isSuceesss() {
        return suceesss;
    }
    public void setSuceesss(boolean suceesss) {
        this.suceesss = suceesss;
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
```

```java
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class FileUtils {
    // 默认400像素宽度
    final static double THUMBNAIL_WIDTH = 400;

    public static String getRunPath() {
        return System.getProperty("user.dir");
    }

    /**
     * 写文件
     *
     * @param text     文本
     * @param fileName 文件流
     */
    public static void writeFile(String text, String fileName) {
        try {
            File file = new File(fileName);
            //if file doesnt exists, then create it
            if (!file.exists()) {
                file.createNewFile();
            }
            //true = append file
            FileWriter fileWritter = new FileWriter(file.getName(), true);
            fileWritter.write(text);
            fileWritter.close();
            System.out.println("Done");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 导出资源文件
     *
     * @param resFullName 资源文件
     * @param saveName    保存名字
     * @param isDownload  是否下载
     * @param response    响应
     */
    public static void exportRes(String resFullName, String saveName, Boolean isDownload, HttpServletResponse response) {
        try {
            ClassPathResource resource = new ClassPathResource(resFullName);
            if (!resource.exists()) {
                throw new IOException("文件不存在");
            }
            // 以流的形式下载文件。
            InputStream fis = resource.getInputStream();
            export(fis, saveName, isDownload, response);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 导出文件
     *
     * @param fileFullName 文件完整名称
     * @param isDownload   是否下载，否则在线打开
     * @param response     网络响应
     */
    public static void export(String fileFullName, Boolean isDownload, HttpServletResponse response) {
        export(fileFullName, null, isDownload, response);
    }


    /**
     * 导出文件
     *
     * @param fileFullName 文件完整名称
     * @param saveName     保存名称
     * @param isDownload   是否下载，否则在线打开
     * @param response     网络响应
     */
    public static void export(String fileFullName, String saveName, Boolean isDownload, HttpServletResponse response) {
        try {
            File file = new File(fileFullName);
            if (!file.exists()) {
                throw new IOException("文件不存在");
            }
            // 如果保存名称为空，则取文件名
            if (StringUtils.isBlank(saveName)) {
                saveName = file.getName();
            }
            // 以流的形式下载文件。
            InputStream fis = new BufferedInputStream(new FileInputStream(file));
            export(fis, saveName, isDownload, response);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 导出文件
     *
     * @param fs         文件流
     * @param saveName   下载保存名字
     * @param isDownload 是否下载
     * @param response   响应
     */
    static void export(InputStream fs, String saveName, Boolean isDownload, HttpServletResponse response) throws IOException {
        saveName = new String(saveName.getBytes("UTF-8"), "ISO-8859-1");
        // 清空response
        response.reset();
        // 设置response的Header
        response.setCharacterEncoding("UTF-8");
        if (isDownload) {
            response.addHeader("Content-Disposition", "attachment;filename=" + saveName);
//            response.setContentType("application/octet-stream");
        } else {
            response.addHeader("Content-Disposition", "inline;filename=" + saveName);
        }
        String suffix = saveName.substring(saveName.lastIndexOf(".") + 1);
        response.setContentType(MimeUtils.getMineFormExt(suffix));
        // 循环取出流中的数据
        byte[] b = new byte[100];
        int len;
        while ((len = fs.read(b)) > 0) {
            response.getOutputStream().write(b, 0, len);
        }
        fs.close();
    }

    /**
     * 上传文件
     *
     * @param req       请求
     * @param multiReq  多段请求
     * @param basePath  基本路径
     * @param childPath 子路径
     * @param filterExt 过滤文件扩展名
     * @param isImage   是否图像
     * @return
     */
    public static ResultEntity uploadFile(HttpServletRequest req,
                                          MultipartHttpServletRequest multiReq, String basePath, String childPath, String filterExt, boolean isImage, boolean thumbnail, boolean watermark) {
        // 获取上传文件的路径
        String uploadFileName = multiReq.getFile("file").getOriginalFilename();
        FileOutputStream fos = null;
        FileInputStream fis = null;
        String fileUrl = "";
        ResultEntity res = null;
        try {
            fis = (FileInputStream) multiReq.getFile("file").getInputStream();
            String ext = uploadFileName.substring(uploadFileName.lastIndexOf(".")).toLowerCase();
            if (filterExt.toLowerCase().indexOf(ext) < 0) {
                res = new ResultEntity(false, "0", "不支持的文件格式");
            } else {
                // 按日期生成文件名
                String newFileName = Long.toString(System.currentTimeMillis());
                fileUrl = childPath + newFileName + ext;
                String saveFullFileName = basePath + fileUrl;
                File dest = new File(saveFullFileName);
                if (!dest.getParentFile().exists()) { //判断文件父目录是否存在
                    dest.getParentFile().mkdirs();
                }
                // 判断是否图像，是就创建水印
                if (isImage) {
                    ImgUtils imgUtils = new ImgUtils();
                    String err;
                    if (thumbnail) {
                        // 默认400宽度
                        err = imgUtils.createThumbnailAndWatermark(fis, THUMBNAIL_WIDTH, false, watermark, saveFullFileName);
                    } else {
                        err = imgUtils.createThumbnailAndWatermark(fis, 1, true, watermark, saveFullFileName);
                    }
                    if (!StringUtils.isBlank(err)) {
                        res = new ResultEntity(false, "0", err);
                    } else {
                        res = new ResultEntity(true, "1", fileUrl);
                    }
                } else {
                    fos = new FileOutputStream(dest);
                    byte[] temp = new byte[1024];
                    int i = fis.read(temp);
                    while (i != -1) {
                        fos.write(temp, 0, temp.length);
                        fos.flush();
                        i = fis.read(temp);
                    }
                    res = new ResultEntity(true, "1", fileUrl);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            res = new ResultEntity(false, "0", e.getMessage());
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return res;
        }
    }
}
```

### Sftp

```java
<!-- Sftp工具 -->
<dependency>
    <groupId>com.jcraft</groupId>
    <artifactId>jsch</artifactId>
    <version>0.1.54</version>
</dependency>
```

```java
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Vector;
import org.apache.log4j.Logger;
import com.jcraft.jsch.*;
import com.jcraft.jsch.ChannelSftp.LsEntry;

public class SftpClientUtil
{
    private static final Logger logger = Logger.getLogger(SftpClientUtil.class);

    /** Sftp */
    private ChannelSftp sftp = null;
    /** 主机 */
    private String host = "";
    /** 端口 */
    private int port = 0;
    /** 用户名 */
    private String username = "";
    /** 密码 */
    private String password = "";

    /**
     * 构造函数
     *
     * @param host 主机
     * @param port 端口
     * @param username 用户名
     * @param password 密码
     *
     */
    public SftpClientUtil(String host, int port, String username, String password)
    {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    /**
     * 连接sftp服务器
     *
     * @throws Exception
     */
    public void connect() throws Exception
    {

        JSch jsch = new JSch();
        Session sshSession = jsch.getSession(this.username, this.host, this.port);
        logger.debug(SftpClientUtil.class + "Session created.");

        sshSession.setPassword(password);
        Properties sshConfig = new Properties();
        sshConfig.put("StrictHostKeyChecking", "no");
        sshSession.setConfig(sshConfig);
        sshSession.connect(20000);
        logger.debug(SftpClientUtil.class + " Session connected.");

        logger.debug(SftpClientUtil.class + " Opening Channel.");
        Channel channel = sshSession.openChannel("sftp");
        channel.connect();
        this.sftp = (ChannelSftp) channel;
        logger.debug(SftpClientUtil.class + " Connected to " + this.host + ".");
    }

    /**
     * Disconnect with server
     * @throws Exception
     */
    public void disconnect() throws Exception
    {
        if (this.sftp != null)
        {
            if (this.sftp.isConnected())
            {
                this.sftp.disconnect();
            } else if (this.sftp.isClosed())
            {
                logger.debug(SftpClientUtil.class + " sftp is closed already");
            }
        }
    }

    /**
     * 下载单个文件
     *
     * @param directory 下载目录
     * @param downloadFile 下载的文件
     * @param saveDirectory 存在本地的路径
     * @throws Exception
     */
    public void download(String directory, String downloadFile, String saveDirectory) throws Exception
    {
        File pathFile = new File(saveDirectory);
        if (!pathFile.exists())
        {
            pathFile.mkdirs();
        }
        String saveFile = saveDirectory + "//" + downloadFile;
        this.sftp.cd(directory);
        File file = new File(saveFile);
        this.sftp.get(downloadFile, new FileOutputStream(file));
    }

    /**
     * 下载目录下全部文件
     *
     * @param directory 下载目录
     * @param saveDirectory 存在本地的路径
     * @throws Exception
     */
    public void downloadByDirectory(String directory, String saveDirectory) throws Exception
    {
        String downloadFile = "";
        List<String> downloadFileList = this.listFiles(directory);
        Iterator<String> it = downloadFileList.iterator();
        while (it.hasNext())
        {
            downloadFile = it.next().toString();
            if (downloadFile.toString().indexOf(".") < 0)
            {
                continue;
            }
            this.download(directory, downloadFile, saveDirectory);
        }
    }

    /**
     * 新建子目录
     *
     * @param dst 远程服务器路径
     * @throws Exception
     */
    public void mkdir(String dst, String subDir) throws Exception
    {
        this.sftp.cd(dst);
        try {
            if(this.sftp.ls(subDir).size() > 0) {
                return;
            }
        } catch (SftpException se) {
            logger.error(se.getMessage());
        }
        this.sftp.mkdir(subDir);
    }

    /**
     * 上传单个文件
     *
     * @param src 本地文件
     * @param dst 远程服务器路径
     * @throws Exception
     */
    public void upload(String src, String dst) throws Exception
    {
        this.sftp.put(src, dst);
    }

    /**
     * 列出目录下的文件
     *
     * @param directory 要列出的目录
     * @return list 文件名列表
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public List<String> listFiles(String directory) throws Exception
    {
        Vector fileList;
        List<String> fileNameList = new ArrayList<String>();
        fileList = this.sftp.ls(directory);
        Iterator it = fileList.iterator();
        while (it.hasNext())
        {
            String fileName =((LsEntry) it.next()).getFilename();
            if (".".equals(fileName) || "..".equals(fileName))
            {
                continue;
            }
            fileNameList.add(fileName);
        }
        return fileNameList;
    }

    public ChannelSftp getSftp()
    {
        return sftp;
    }

    public void setSftp(ChannelSftp sftp)
    {
        this.sftp = sftp;
    }
}
```

### 图片处理

```java
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Random;

import javax.imageio.ImageIO;

/**
 * 图像处理: 1、水印文字 2、水印图标 3、缩略图 4、裁剪图像
 *
 */
public class ImgUtils {
    private File file; // 原文件或目录
    private String text = "测试水印"; // 水印文字
    private Color color = new Color(255, 255, 255); // 水印字体颜色及透明度
    private Font font = new Font("simhei", Font.PLAIN, 14); // 水印字体
    private String dir; // 水印图片存放目录
    private int position = 8;// 水印位置

    /**
     * @param file 原图
     * @param dir 存放目录
     */
    public ImgUtils(File file, String dir) {
        this.file = file;
        this.dir = dir;
    }

    public ImgUtils() {

    }

    /**
     * @return 获取文字
     */
    public String getText() {
        return text;
    }

    /**
     * @param text 水印文字设置
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * @return 获取颜色
     */
    public Color getColor() {
        return color;
    }

    /**
     * @param color 设置水印字体颜色及透明度
     */
    public void setColor(Color color) {
        this.color = color;
    }

    /**
     * @return 获取字体
     */
    public Font getFont() {
        return font;
    }

    /**
     * @param font 水印字体设置
     */
    public void setFont(Font font) {
        this.font = font;
    }

    /**
     * @return 获取存放目录
     */
    public String getDir() {
        return dir;
    }

    /**
     * @param dir 设置水印图片存放目录
     */
    public void setDir(String dir) {
        this.dir = dir;
    }

    /**
     * @return 获取位置
     */
    public int getPosition() {
        return position;
    }

    /**
     * @param position 设置水印位置
     */
    public void setPosition(int position) {
        this.position = position;
    }

    private String checkFile() {
        String msg = null;
        if (file == null || !file.canRead()) {
            msg = "文件不存在";
        } else if (".jpg;.jpeg;.png;.bmp".indexOf(file.getName().toLowerCase()) < 0) {
            msg = "图片文件格式只支持：jpg、png、bmp";
        }
        return msg;
    }

    /**
     *
     * @param stream 数据流
     * @param size 大小
     * @param isRateSize 比例还是实际宽度
     * @param createWatermark 是否创建水印
     * @param saveFileName 保存文件名
     * @return
     */
    public String createThumbnailAndWatermark(InputStream stream, double size, boolean isRateSize, boolean createWatermark, String saveFileName) {
        try {
            BufferedImage bf = ImageIO.read(stream);
            int iw = bf.getWidth();
            int ih = bf.getHeight();
            int w,h;
            // 如果是比例大小，按比例缩放
            if (isRateSize) {
                w = (int) (iw * size);
                h = (int) (ih * size);
            } else {
                w = (int) size;
                h = (int) ((double) size / iw * ih);
            }
            BufferedImage di = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            Graphics g = di.getGraphics();
            g.drawImage(bf, 0, 0, w, h, null);
            if(createWatermark) {
                this.drawString(bf, g, position, w, h);
            }
            g.dispose();
            File dir = new File(saveFileName);
            if (!dir.getParentFile().exists()) {
                return "指定存放目录不存在！！";
            }
            ImageIO.write(di, "jpg", dir);
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    private void drawString(BufferedImage bf, Graphics g, int position, int width, int height){
        g.setFont(font); // 设置字体
        g.setColor(color); // 设置颜色
        FontMetrics f = g.getFontMetrics(); // 创建字体规格
        int fw = f.stringWidth(text); // 获取字体宽度
        int fh = f.getHeight(); // 获取字体高度
        int x = 0, y = 0, offset = 14;
        Random r = new Random();
        switch (position) {
            case 1: // 左上
                x = offset;
                y = offset + font.getSize();
                break;
            case 2: // 中上
                x = (int) ((width - fw) / 2f);
                y = offset + font.getSize();
                break;
            case 3: // 右上
                x = width - fw - offset;
                y = offset + font.getSize();
                break;
            case 4: // 左中
                x = offset;
                y = (int) ((height - fh) / 2f) + font.getSize();
                break;
            case 5: // 中心
                x = (int) ((width - fw) / 2f);
                y = (int) ((height - fh) / 2f) + font.getSize();
                break;
            case 6: // 右中
                x = width - fw - offset;
                y = (int) ((height - fh) / 2f) + font.getSize();
                break;
            case 7: // 左下
                x = offset;
                y = height - fh - offset + font.getSize();
                break;
            case 8: // 中下
                x = (int) ((width - fw) / 2f);
                y = height - fh - offset + font.getSize();
                break;
            case 9: // 右下
                x = width - fw - offset;
                y = height - fh - offset + font.getSize();
                break;
            default: // 随机
                x = r.nextInt(width - fw - offset) + offset;
                y = r.nextInt(height - fh - offset) + font.getSize();
                break;
        }
        g.drawString(text, x, y);// 写入文字
    }

    /**
     * 添加水印文字
     */
    public String addWatermark() {
        try {
            String msg = checkFile();
            if (msg != null) {
                return msg;
            }
            BufferedImage bf = ImageIO.read(file); // 读取文件
            Graphics g = bf.getGraphics();// 创建画笔
            // 书写
            this.drawString(bf, g, position, bf.getWidth(), bf.getHeight());
            g.dispose();// 关闭画笔
            String ext = file.getName().substring(file.getName().lastIndexOf(".") + 1);
            File dir = new File(this.dir + file.getName().substring(0, file.getName().lastIndexOf(".")) + "_text." + ext);
            if (!dir.getParentFile().exists()) {
                return "指定存放目录不存在！！";
            }
            ImageIO.write(bf, "jpg", dir);// 写入图片
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据百分比生成缩略图
     *
     * @param thum 指定缩略图的百分比
     */
    public String createImgThumbnail(double thum) {
        try {
            String msg = checkFile();
            if (msg != null) {
                return msg;
            }
            BufferedImage i = ImageIO.read(file);
            int iw = i.getWidth();
            int ih = i.getHeight();
            int w = (int) (iw * thum);
            int h = (int) (ih * thum);
            BufferedImage di = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            Graphics g = di.getGraphics();
            g.drawImage(i, 0, 0, w, h, null);
            g.dispose();
            String ext = file.getName().substring(file.getName().lastIndexOf(".") + 1);
            File dir = new File(this.dir + file.getName().substring(0, file.getName().lastIndexOf(".")) + "_p_thum." + ext);
            if (!dir.getParentFile().exists()) {
                return "指定存放目录不存在！！";
            }
            ImageIO.write(di, "jpg", dir);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据宽生成缩略图
     *
     * @param thum 指定缩略图的宽
     */
    public String createThumbnail(int thum) {
        try {
            String msg = checkFile();
            if (msg != null) {
                return msg;
            }
            BufferedImage i = ImageIO.read(file);
            int iw = i.getWidth();
            int ih = i.getHeight();
            int w = thum;
            int h = (int) ((double) thum / iw * ih);
            BufferedImage di = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            Graphics g = di.getGraphics();
            g.drawImage(i, 0, 0, w, h, null);
            g.dispose();
            String ext = file.getName().substring(file.getName().lastIndexOf(".") + 1);
            File dir = new File(this.dir + file.getName().substring(0, file.getName().lastIndexOf(".")) + "_w_thum." + ext);
            if (!dir.getParentFile().exists()) {
                return "指定存放目录不存在！！";
            }
            ImageIO.write(di, "jpg", dir);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 裁剪图像
     *
     * @param w 剪切的宽
     * @param h 剪切的高
     * @param x 指定从原图的宽开始
     * @param y 指定从原图的高开始
     */
    public void imgCrop(int w, int h, int x, int y) {
        try {
            if (!file.canRead()) {
                System.out.println("请定义一个原图文件");
                return;
            } else if (!file.getName().toLowerCase().endsWith(".jpg")) {
                if (!file.getName().toLowerCase().endsWith(".png")) {
                    System.out.println("请先定义原图片文件,格式为：jpg、png");
                    return;
                }
            }
            BufferedImage bi = ImageIO.read(file);
            BufferedImage ni = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            Graphics g = ni.getGraphics();
            int nw = w + x;
            int nh = h + y;
            g.drawImage(bi, 0, 0, w, h, x, y, nw, nh, null);
            g.dispose();
            String ext = file.getName().substring(file.getName().lastIndexOf(".") + 1);
            File dir = new File(this.dir + file.getName().substring(0, file.getName().lastIndexOf(".")) + "_crop." + ext);
            if (!dir.getParentFile().exists()) {
                System.out.println("指定存放目录不存在！！");
                return;
            }
            ImageIO.write(ni, "jpg", dir);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 图片转换

```java
package io.easy.common.utils;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class Base64Utils {
    /**
     * 测试
     * @param args
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {

        //图片--->base64
        //本地图片
        String url = "D:/Project/workbench-ui/src/assets/images/arc-bar.png";
        String str = Base64Utils.ImageToBase64ByLocal(url);
        System.out.println("data:image/png;base64," + str);

        //在线图片地址
        String string = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1705581946,4177791147&fm=26&gp=0.jpg";
        String ste = Base64Utils.ImageToBase64ByOnline(string);
        System.out.println("data:image/png;base64," + ste);
    }

    /**
     * 本地图片转换成base64字符串
     * @param imgFile    图片本地路径
     * @author jsh
     */
    public static String ImageToBase64ByLocal(String imgFile) {// 将图片文件转化为字节数组字符串，并对其进行Base64编码处理
        InputStream in = null;
        byte[] data = null;
        try {
            in = new FileInputStream(imgFile);

            data = new byte[in.available()];
            in.read(data);
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);
    }

    /**
     * 在线图片转换成base64字符串
     * @param imgURL    图片线上路径
     * @author jsh
     */
    public static String ImageToBase64ByOnline(String imgURL) {
        ByteArrayOutputStream data = new ByteArrayOutputStream();
        try {
            URL url = new URL(imgURL);
            byte[] by = new byte[1024];
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            InputStream is = conn.getInputStream();
            int len = -1;
            while ((len = is.read(by)) != -1) {
                data.write(by, 0, len);
            }
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data.toByteArray());
    }

    /**
     * 验证字符串是否为空
     *
     * @param input
     * @return
     */
    private static boolean isEmpty(String input) {
        return input == null || input.equals("");
    }
}
```

### Excel

```java
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ExcelUtil {
    public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";
    public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";
    public static final String EMPTY = "";
    public static final String POINT = ".";
    public static SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");

    /**
     * 获得path的后缀名
     *
     * @param path
     * @return
     */
    public static String getPostfix(String path) {
        if (path == null || EMPTY.equals(path.trim())) {
            return EMPTY;
        }
        if (path.contains(POINT)) {
            return path.substring(path.lastIndexOf(POINT) + 1, path.length());
        }
        return EMPTY;
    }

    /**
     * 单元格格式
     *
     * @param hssfCell
     * @return
     */
    @SuppressWarnings({"static-access", "deprecation"})
    public static String getHValue(HSSFCell hssfCell) {
        if (hssfCell.getCellType() == CellType.BOOLEAN) {
            return String.valueOf(hssfCell.getBooleanCellValue());
        } else if (hssfCell.getCellType() == CellType.NUMERIC) {
            String cellValue = "";
            if (HSSFDateUtil.isCellDateFormatted(hssfCell)) {
                Date date = HSSFDateUtil.getJavaDate(hssfCell.getNumericCellValue());
                cellValue = sdf.format(date);
            } else {
                DecimalFormat df = new DecimalFormat("#.##");
                cellValue = df.format(hssfCell.getNumericCellValue());
                String strArr = cellValue.substring(cellValue.lastIndexOf(POINT) + 1, cellValue.length());
                if (strArr.equals("00")) {
                    cellValue = cellValue.substring(0, cellValue.lastIndexOf(POINT));
                }
            }
            return cellValue;
        } else {
            return String.valueOf(hssfCell.getStringCellValue());
        }
    }

    /**
     * 单元格格式
     *
     * @param xssfCell
     * @return
     */
    public static String getXValue(XSSFCell xssfCell) {
        if (xssfCell.getCellType() == CellType.BOOLEAN) {
            return String.valueOf(xssfCell.getBooleanCellValue());
        } else if (xssfCell.getCellType() == CellType.NUMERIC) {
            String cellValue = "";
            if (XSSFDateUtil.isCellDateFormatted(xssfCell)) {
                Date date = XSSFDateUtil.getJavaDate(xssfCell.getNumericCellValue());
                cellValue = sdf.format(date);
            } else {
                DecimalFormat df = new DecimalFormat("#.##");
                cellValue = df.format(xssfCell.getNumericCellValue());
                String strArr = cellValue.substring(cellValue.lastIndexOf(POINT) + 1, cellValue.length());
                if (strArr.equals("00")) {
                    cellValue = cellValue.substring(0, cellValue.lastIndexOf(POINT));
                }
            }
            return cellValue;
        } else {
            return String.valueOf(xssfCell.getStringCellValue());
        }
    }

    public static int totalCells; //每一行总单元格数

    /**
     * read the Excel .xlsx,.xls
     *
     * @param fileName jsp中的上传文件
     * @param input
     * @return
     * @throws IOException
     */
    public List<ArrayList<String>> readExcel(String fileName, InputStream input) throws IOException {
        if (input == null || ExcelUtil.EMPTY.equals(fileName.trim())) {
            return null;
        } else {
            String postfix = ExcelUtil.getPostfix(fileName);
            if (!ExcelUtil.EMPTY.equals(postfix)) {
                if (ExcelUtil.OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
                    return readXls(input);
                } else if (ExcelUtil.OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
                    return readXlsx(input);
                } else {
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * read the Excel 2010 .xlsx
     *
     * @param input
     * @return
     * @throws IOException
     */
    @SuppressWarnings("deprecation")
    public List<ArrayList<String>> readXlsx(InputStream input) {
        List<ArrayList<String>> list = new ArrayList<ArrayList<String>>();
        // IO流读取文件
        XSSFWorkbook wb = null;
        ArrayList<String> rowList = null;
        Integer totalRows;
        try {
            // 创建文档
            wb = new XSSFWorkbook(input);
            //读取sheet(页)
            for (int numSheet = 0; numSheet < wb.getNumberOfSheets(); numSheet++) {
                XSSFSheet xssfSheet = wb.getSheetAt(numSheet);
                if (xssfSheet == null) {
                    continue;
                }
                totalRows = xssfSheet.getLastRowNum();
                //读取Row,从第二行开始
                for (int rowNum = 1; rowNum <= totalRows; rowNum++) {
                    XSSFRow xssfRow = xssfSheet.getRow(rowNum);
                    if (xssfRow != null) {
                        rowList = new ArrayList<String>();
                        totalCells = xssfRow.getLastCellNum();
                        //读取列，从第一列开始
                        for (int c = 0; c <= totalCells + 1; c++) {
                            XSSFCell cell = xssfRow.getCell(c);
                            if (cell == null) {
                                rowList.add(ExcelUtil.EMPTY);
                                continue;
                            }
                            rowList.add(ExcelUtil.getXValue(cell).trim());
                        }
                        list.add(rowList);
                    }
                }
            }
            return list;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * read the Excel 2003-2007 .xls
     *
     * @param input
     * @return
     * @throws IOException
     */
    public List<ArrayList<String>> readXls(InputStream input) {
        List<ArrayList<String>> list = new ArrayList<ArrayList<String>>();
        // IO流读取文件
        HSSFWorkbook wb = null;
        ArrayList<String> rowList = null;
        Integer totalRows;
        try {
            // 创建文档
            wb = new HSSFWorkbook(input);
            //读取sheet(页)
            for (int numSheet = 0; numSheet < wb.getNumberOfSheets(); numSheet++) {
                HSSFSheet hssfSheet = wb.getSheetAt(numSheet);
                if (hssfSheet == null) {
                    continue;
                }
                totalRows = hssfSheet.getLastRowNum();
                //读取Row,从第二行开始
                for (int rowNum = 1; rowNum <= totalRows; rowNum++) {
                    HSSFRow hssfRow = hssfSheet.getRow(rowNum);
                    if (hssfRow != null) {
                        rowList = new ArrayList<String>();
                        totalCells = hssfRow.getLastCellNum();
                        //读取列，从第一列开始
                        for (short c = 0; c <= totalCells + 1; c++) {
                            HSSFCell cell = hssfRow.getCell(c);
                            if (cell == null) {
                                rowList.add(ExcelUtil.EMPTY);
                                continue;
                            }
                            rowList.add(ExcelUtil.getHValue(cell).trim());
                        }
                        list.add(rowList);
                    }
                }
            }
            return list;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static void exportExcel(HSSFWorkbook wb, HttpServletResponse response) {
        // 第六步，下载excel
        OutputStream out = null;
        try {
            out = response.getOutputStream();
            String fileName = "enroll.xls";// 文件名
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename="
                    + URLEncoder.encode(fileName, "UTF-8"));
            wb.write(out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                out.close();
                wb.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 数据

### 时间

```java
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
   /** 时间格式(yyyy-MM-dd) */
   public final static String DATE_PATTERN = "yyyy-MM-dd";
   /** 时间格式(yyyy-MM-dd HH:mm:ss) */
   public final static String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /**
     * 日期格式化 日期格式为：yyyy-MM-dd
     * @param date  日期
     * @return  返回yyyy-MM-dd格式日期
     */
   public static String format(Date date) {
        return format(date, DATE_PATTERN);
    }

    /**
     * 日期格式化 日期格式为：yyyy-MM-dd
     * @param date  日期
     * @param pattern  格式，如：DateUtils.DATE_TIME_PATTERN
     * @return  返回yyyy-MM-dd格式日期
     */
    public static String format(Date date, String pattern) {
        if(date != null){
            SimpleDateFormat df = new SimpleDateFormat(pattern);
            return df.format(date);
        }
        return null;
    }

    /**
     * 字符串转换成日期
     * @param strDate 日期字符串
     * @param pattern 日期的格式，如：DateUtils.DATE_TIME_PATTERN
     */
    public static Date stringToDate(String strDate, String pattern) {
        if (StringUtils.isBlank(strDate)){
            return null;
        }

        DateTimeFormatter fmt = DateTimeFormat.forPattern(pattern);
        return fmt.parseLocalDateTime(strDate).toDate();
    }

    /**
     * 根据周数，获取开始日期、结束日期
     * @param week  周期  0本周，-1上周，-2上上周，1下周，2下下周
     * @return  返回date[0]开始日期、date[1]结束日期
     */
    public static Date[] getWeekStartAndEnd(int week) {
        DateTime dateTime = new DateTime();
        LocalDate date = new LocalDate(dateTime.plusWeeks(week));

        date = date.dayOfWeek().withMinimumValue();
        Date beginDate = date.toDate();
        Date endDate = date.plusDays(6).toDate();
        return new Date[]{beginDate, endDate};
    }

    /**
     * 对日期的【秒】进行加/减
     *
     * @param date 日期
     * @param seconds 秒数，负数为减
     * @return 加/减几秒后的日期
     */
    public static Date addDateSeconds(Date date, int seconds) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusSeconds(seconds).toDate();
    }

    /**
     * 对日期的【分钟】进行加/减
     *
     * @param date 日期
     * @param minutes 分钟数，负数为减
     * @return 加/减几分钟后的日期
     */
    public static Date addDateMinutes(Date date, int minutes) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusMinutes(minutes).toDate();
    }

    /**
     * 对日期的【小时】进行加/减
     *
     * @param date 日期
     * @param hours 小时数，负数为减
     * @return 加/减几小时后的日期
     */
    public static Date addDateHours(Date date, int hours) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusHours(hours).toDate();
    }

    /**
     * 对日期的【天】进行加/减
     *
     * @param date 日期
     * @param days 天数，负数为减
     * @return 加/减几天后的日期
     */
    public static Date addDateDays(Date date, int days) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusDays(days).toDate();
    }

    /**
     * 对日期的【周】进行加/减
     *
     * @param date 日期
     * @param weeks 周数，负数为减
     * @return 加/减几周后的日期
     */
    public static Date addDateWeeks(Date date, int weeks) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusWeeks(weeks).toDate();
    }

    /**
     * 对日期的【月】进行加/减
     *
     * @param date 日期
     * @param months 月数，负数为减
     * @return 加/减几月后的日期
     */
    public static Date addDateMonths(Date date, int months) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusMonths(months).toDate();
    }

    /**
     * 对日期的【年】进行加/减
     *
     * @param date 日期
     * @param years 年数，负数为减
     * @return 加/减几年后的日期
     */
    public static Date addDateYears(Date date, int years) {
        DateTime dateTime = new DateTime(date);
        return dateTime.plusYears(years).toDate();
    }

    public static String secondToDate(Long result) {
        Long h =  result / 3600;
        Long m = result / 60 % 60;
        Long s = result % 60;
        String dateString = h + ":" + m + ":" + s;
        return dateString;
    }
}
```

### 人民币大写

```java
public static void main(String[] args) {
    System.out.println("数字转换为人民币的大写测试");
    System.out.println("193847032471.23 ==> " + NumberToCN.numberToCn(new BigDecimal(193847032471.23)));
}
```

```java
import java.math.BigDecimal;

/**
 * 数字转换为人民币的大写
 * NumberToCN.java
 *
 */
public class NumberToCN {
    /**
     * 汉语中数字大写
     */
    private static final String[] CN_UPPER_NUMBER = { "零", "壹", "贰", "叁", "肆",
            "伍", "陆", "柒", "捌", "玖" };
    /**
     * 汉语中货币单位大写，这样的设计类似于占位符
     */
    private static final String[] CN_UPPER_MONETRAY_UNIT = { "分", "角", "元",
            "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "兆", "拾",
            "佰", "仟" };
    /**
     * 特殊字符：整
     */
    private static final String CN_FULL = "整";
    /**
     * 特殊字符：负
     */
    private static final String CN_NEGATIVE = "负";
    /**
     * 金额的精度，默认值为2
     */
    private static final int MONEY_PRECISION = 2;
    /**
     * 特殊字符：零元整
     */
    private static final String CN_ZEOR_FULL = "零元" + CN_FULL;

    /**
     * 把输入的金额转换为汉语中人民币的大写
     *
     * @param numberOfMoney
     *            输入的金额
     * @return 对应的汉语大写
     */
    public static String numberToCn(BigDecimal numberOfMoney) {
        StringBuffer sb = new StringBuffer();
        // -1, 0, or 1 as the value of this BigDecimal is negative, zero, or
        // positive.
        int signum = numberOfMoney.signum();
        // 零元整的情况
        if (signum == 0) {
            return CN_ZEOR_FULL;
        }
        //这里会进行金额的四舍五入
        long number = numberOfMoney.movePointRight(MONEY_PRECISION)
                .setScale(0, 4).abs().longValue();
        // 得到小数点后两位值
        long scale = number % 100;
        int numUnit = 0;
        int numIndex = 0;
        boolean getZero = false;
        // 判断最后两位数，一共有四中情况：00 = 0, 01 = 1, 10, 11
        if (!(scale > 0)) {
            numIndex = 2;
            number = number / 100;
            getZero = true;
        }
        if ((scale > 0) && (!(scale % 10 > 0))) {
            numIndex = 1;
            number = number / 10;
            getZero = true;
        }
        int zeroSize = 0;
        while (true) {
            if (number <= 0) {
                break;
            }
            // 每次获取到最后一个数
            numUnit = (int) (number % 10);
            if (numUnit > 0) {
                if ((numIndex == 9) && (zeroSize >= 3)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[6]);
                }
                if ((numIndex == 13) && (zeroSize >= 3)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[10]);
                }
                sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                sb.insert(0, CN_UPPER_NUMBER[numUnit]);
                getZero = false;
                zeroSize = 0;
            } else {
                ++zeroSize;
                if (!(getZero)) {
                    sb.insert(0, CN_UPPER_NUMBER[numUnit]);
                }
                if (numIndex == 2) {
                    if (number > 0) {
                        sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                    }
                } else if (((numIndex - 2) % 4 == 0) && (number % 1000 > 0)) {
                    sb.insert(0, CN_UPPER_MONETRAY_UNIT[numIndex]);
                }
                getZero = true;
            }
            // 让number每次都去掉最后一个数
            number = number / 10;
            ++numIndex;
        }
        // 如果signum == -1，则说明输入的数字为负数，就在最前面追加特殊字符：负
        if (signum == -1) {
            sb.insert(0, CN_NEGATIVE);
        }
        // 输入的数字小数点后两位为"00"的情况，则要在最后追加特殊字符：整
        if (!(scale > 0)) {
            sb.append(CN_FULL);
        }
        return sb.toString();
    }
}
```

### 字符串

```java
import org.apache.commons.lang.StringEscapeUtils;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {

    public static boolean isBlank(Object str) {
        return str == null || str.toString().isEmpty();
    }

    public static boolean isBlank(String str) {
        return str == null || str.isEmpty();
    }

    public static Pattern TRIM_PATTERN = Pattern.compile("\\s*|\t|\r|\n");

    /**
     * 去除首位空格
     * @param str 输入字符串
     * @return 去除首位空格后的字符串
     */
    public static String trimString(String str) {
        str = str + "";
        str = str.trim();
        return str;
    }

    /**
     * 替换参数格式化
     * @param formatString 待格式化字符串
     * @param matchReplaceList 匹配替换列表
     * @return 替换结果
     */
    public static String parseString(String formatString, Map<String, String> matchReplaceList) {
        int count = matchReplaceList.size();
        String url = formatString;
        for (String key : matchReplaceList.keySet()) {
            url = url.replaceAll(key, matchReplaceList.get(key));
        }
        return url;
    }

    /**
     * 限制字符串长度
     * 如果输入字符串越界，则打印信息
     * @param inputStr 输入字符串
     * @param limitLength 限制字符长度
     * @return 处理后的字符串
     */
    public static String limitLength(String inputStr, int limitLength) {
        // 正则表达式规则
        String regEx = "^\\w*\\s*\\.\\s*";
        // 编译正则表达式
        Pattern pattern = Pattern.compile(regEx);
        // 忽略大小写的写法
        // Pattern pat = Pattern.compile(regEx, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr.trim());
        // 查找字符串中是否有匹配正则表达式的字符/字符串
        String result = matcher.replaceAll("");
        if(limitLength > 0 && result.length() > limitLength) {
            result = result.substring(0, limitLength - 1);
        }
        return result;
    }

    /**
     * 清除空白字符串
     * @param str 原始字符串
     * @return 清除空白字符后的字符串
     */
    public static String replaceBlank(String str){
        String dest = null;
        if(str == null){
            return dest;
        }else{
            Matcher m = TRIM_PATTERN.matcher(str);
            dest = m.replaceAll("");
            return dest;
        }
    }

    /**
     * 隐藏信息
     * @param str 输入字符串
     * @param replaceSymbol 替换符号
     * @param beforeLength 开始长度
     * @param afterLength 尾部长度，两者之间内容用符号替换
     * @return 处理后字符串
     */
    public static String hideInfo(String str, String replaceSymbol, int beforeLength, int afterLength) {
        if(StringUtils.isBlank(str)) {
            return str;
        }
        if(StringUtils.isBlank(replaceSymbol)) {
            replaceSymbol = "*";        // 替换字符串，默认使用“*”
        }
        int length = str.length();
        int maxIndex = length - afterLength;
        StringBuffer sb = new StringBuffer();
        for(int i=0; i<length; i++) {
            if(i < beforeLength || (i >= maxIndex && maxIndex>1)) {
                sb.append(str.charAt(i));
            } else {
                sb.append(replaceSymbol);
            }
        }
        return sb.toString();
    }

    /**
     *
     * 方法描述 隐藏银行卡号中间的字符串（使用*号），显示前四后四
     *
     * @param cardNo 卡号
     * @return 处理后字符串
     */
    public static String hideCardNo(String cardNo) {
        return hideInfo(cardNo, "*", 4, 4);
    }

    /**
     *
     * 方法描述 隐藏手机号中间位置字符，显示前三后三个字符
     *
     * @param phoneNo 手机号码
     * @return 处理后字符串
     *
     */
    public static String hidePhoneNo(String phoneNo) {
        return hideInfo(phoneNo, "*", 3, 3);
    }

    /**
     * 隐藏名字
     * @param name 姓名
     * @return
     */
    public static String hideName(String name) {
        return hideInfo(name, "*", 1, 1);
    }

    public static String unescapeXml(String raw) {
        return StringEscapeUtils.unescapeXml(raw);
    }

    public static String escapeXml(String raw) {
        return StringEscapeUtils.escapeXml(raw);
    }
}
```

### XML转对象

```java
package io.easy.common.utils;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.mapper.MapperWrapper;
import com.thoughtworks.xstream.security.AnyTypePermission;

/**
 * @Description XStream实现xml和对象互相转换的工具
 * @ClassName XmlUtils
 *
 */
public class XStreamXmlUtils {
    private static String XML_TAG = "<?xml version='1.0' encoding='UTF-8'?>";

    /**
     * Description: 私有化构造
     */
    private XStreamXmlUtils() {
        super();
    }
    /**
     * @Description 为每次调用生成一个XStream
     * @Title getInstance
     * @return
     */
    private static XStream getInstance() {
        XStream xStream = new XStream(new DomDriver("UTF-8")) {
            /**
             * 忽略xml中多余字段
             */
            @Override
            protected MapperWrapper wrapMapper(MapperWrapper next) {
                return new MapperWrapper(next) {
                    @SuppressWarnings("rawtypes")
                    @Override
                    public boolean shouldSerializeMember(Class definedIn, String fieldName) {
                        if (definedIn == Object.class) {
                            return false;
                        }
                        return super.shouldSerializeMember(definedIn, fieldName);
                    }
                };
            }
        };

        // 设置默认的安全校验
        XStream.setupDefaultSecurity(xStream);
        // 使用本地的类加载器
        xStream.setClassLoader(XStreamXmlUtils.class.getClassLoader());
        // 允许所有的类进行转换
        xStream.addPermission(AnyTypePermission.ANY);
        return xStream;
    }

    /**
     * @Description 将xml字符串转化为java对象
     * @Title xmlToBean
     * @param xml
     * @param clazz
     * @return
     */
    public static <T> T xmlToBean(String xml, Class<T> clazz) {
        XStream xStream = getInstance();
        xStream.processAnnotations(clazz);
        Object object = xStream.fromXML(xml);
        T cast = clazz.cast(object);
        return cast;
    }

    /**
     * @Description 将java对象转化为xml字符串
     * @Title beanToXml
     * @param object
     * @return
     */
    public static String beanToXml(Object object) {
        XStream xStream = getInstance();
        xStream.processAnnotations(object.getClass());
        // 剔除所有tab、制表符、换行符
        String xml = xStream.toXML(object).replaceAll("\\s+", " ");
        return xml;
    }

    /**
     * @Description 将java对象转化为xml字符串（包含xml头部信息）
     * @Title beanToXml
     * @param object
     * @return
     */
    public static String beanToXmlWithTag(Object object) {
        String xml = XML_TAG + beanToXml(object);
        return xml;
    }
}
```

### 驼峰转换

```java
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>21.0</version>
</dependency>
```

```java
import com.google.common.base.CaseFormat;
 
public class GuavaTester {
 
    @Test
    public void test() {
        System.out.println(CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, "test-data"));//testData
        System.out.println(CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "test_data"));//testData
        System.out.println(CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, "test_data"));//TestData
       System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, "testdata"));//testdata
       System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, "TestData"));//test_data
       System.out.println(CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_HYPHEN, "testData"));//test-data
    }
```

### 对象转换

```java
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

public class ConvertUtils {
    /**
     * Object转成指定的类型
     * @param obj
     * @param type
     * @param <T>
     * @return
     */
    public static<T> T convert(Object obj, Class<T> type) {
        if (obj != null && !StringUtils.isBlank(obj)) {
            String objStr = obj.toString();
            if (type.equals(Integer.class)||type.equals(int.class)) {
                return (T)new Integer(objStr);
            } else if (type.equals(Long.class)||type.equals(long.class)) {
                return (T)new Long(objStr);
            } else if (type.equals(Boolean.class)||type.equals(boolean.class)) {
                return (T) new Boolean(objStr);
            } else if (type.equals(Short.class)||type.equals(short.class)) {
                return (T) new Short(objStr);
            } else if (type.equals(Float.class)||type.equals(float.class)) {
                return (T) new Float(objStr);
            } else if (type.equals(Double.class)||type.equals(double.class)) {
                return (T) new Double(objStr);
            } else if (type.equals(Byte.class)||type.equals(byte.class)) {
                return (T) new Byte(objStr);
            } else if (type.equals(Character.class)||type.equals(char.class)) {
                return (T)new Character(objStr.charAt(0));
            } else if (type.equals(String.class)) {
                return (T) obj;
            } else if (type.equals(BigDecimal.class)) {
                return (T) new BigDecimal(objStr);
            } else if (type.equals(LocalDateTime.class)) {
                //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                return (T) LocalDateTime.parse(objStr);
            } else if (type.equals(Date.class)) {
                try
                {
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                    return (T) formatter.parse(objStr);
                }
                catch (ParseException e)
                {
                    throw new RuntimeException(e.getMessage());
                }

            }else{
                return null;
            }
        } else {
            if (type.equals(int.class)) {
                return (T)new Integer(0);
            } else if (type.equals(long.class)) {
                return (T)new Long(0L);
            } else if (type.equals(boolean.class)) {
                return (T)new Boolean(false);
            } else if (type.equals(short.class)) {
                return (T)new Short("0");
            } else if (type.equals(float.class)) {
                return (T) new Float(0.0);
            } else if (type.equals(double.class)) {
                return (T) new Double(0.0);
            } else if (type.equals(byte.class)) {
                return (T) new Byte("0");
            } else if (type.equals(char.class)) {
                return (T) new Character('\u0000');
            }else {
                return null;
            }
        }
    }
}
```

### POJO、XML、JavaBean类型转换

```java
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.StringReader;
import java.io.StringWriter;

public class JaxbXmlUtils {
    public static final String DEFAULT_ENCODING = "UTF-8";

    /**
     * pojo转换成xml 默认编码UTF-8
     *
     * @param obj 待转化的对象
     * @return xml格式字符串
     * @throws Exception JAXBException
     */
    public static String convertToXml(Object obj) throws Exception {
        return convertToXml(obj, DEFAULT_ENCODING);
    }

    /**
     * pojo转换成xml
     *
     * @param obj 待转化的对象
     * @param encoding 编码
     * @return xml格式字符串
     * @throws Exception JAXBException
     */
    public static String convertToXml(Object obj, String encoding) throws Exception {
        String result = null;

        JAXBContext context = JAXBContext.newInstance(obj.getClass());
        Marshaller marshaller = context.createMarshaller();
        // 指定是否使用换行和缩排对已编组 XML 数据进行格式化的属性名称。
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        marshaller.setProperty(Marshaller.JAXB_ENCODING, encoding);

        StringWriter writer = new StringWriter();
        marshaller.marshal(obj, writer);
        result = writer.toString();

        return result;
    }

    /**
     * xml转换成JavaBean
     *
     * @param xml xml格式字符串
     * @param t 待转化的对象
     * @return 转化后的对象
     * @throws Exception JAXBException
     */
    @SuppressWarnings("unchecked")
    public static <T> T convertToJavaBean(String xml, Class<T> t) throws Exception {
        T obj = null;
        JAXBContext context = JAXBContext.newInstance(t);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        obj = (T) unmarshaller.unmarshal(new StringReader(xml));
        return obj;
    }
}
```

## 解析

### URL参数解析

```java
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UrlUtils {
    /**
     * 解析出url请求的路径，包括页面
     * @param strURL url地址
     * @return url路径
     */
    public static String GetUrl(String strURL)
    {
        String strPage=null;
        String[] arrSplit=null;
        strURL=strURL.trim();
        arrSplit=strURL.split("[?]");
        if(strURL.length()>0)
        {
            if(arrSplit.length>1)
            {
                if(arrSplit[0]!=null)
                {
                    strPage=arrSplit[0];
                }
            }
        }
        return strPage;
    }
    /**
     * 去掉url中的路径，留下请求参数部分
     * @param strURL url地址
     * @return url请求参数部分
     */
    private static String TruncateUrlPage(String strURL)
    {
        String strAllParam=null;
        String[] arrSplit=null;
        strURL=strURL.trim();
        arrSplit=strURL.split("[?]");
        if(strURL.length()>1)
        {
            if(arrSplit.length>1)
            {
                if(arrSplit[1]!=null)
                {
                    strAllParam=arrSplit[1];
                }
            }
        }
        return strAllParam;
    }
    /**
     * @param URL  url地址
     * @param name 获取参数名
     * @return  url请求参数部分
     */
    public static String getParam(String URL,String name)
    {
        Map<String, String> mapRequest = new HashMap<String, String>();
        String[] arrSplit=null;
        String strUrlParam=TruncateUrlPage(URL);
        if(strUrlParam==null)
            return null;
        //每个键值为一组
        arrSplit=strUrlParam.split("[&]");
        for(String strSplit:arrSplit)
        {
            String[] arrSplitEqual=null;
            arrSplitEqual= strSplit.split("[=]");
            //解析出键值
            if(arrSplitEqual.length>1)
            {
                mapRequest.put(arrSplitEqual[0], arrSplitEqual[1]);//正确解析
            }
            else
            {
                if(arrSplitEqual[0]!="")
                {
                    //只有参数没有值，不加入
                    mapRequest.put(arrSplitEqual[0], "");
                }
            }
        }
        return mapRequest.get(name);
    }

    public static void main(String[] args) {
        // 请求url
        String str = "https://xxx.com/easy-xxx/xxx/xxx/xxx?fileName=dmlkZW8vMjAxOS0wOS0yNC8xNTY5MzM2NzQ0MjQ1Lm1wMw==";
        //url页面路径
        System.out.println(UrlUtils.GetUrl(str));
        //url参数键值对
        String strRequestKeyAndValues = UrlUtils.getParam(str,"fileName");
        //获取无效键时，输出null
        System.out.println(strRequestKeyAndValues);
    }

}
```

### 身份证校验

```java
public static void main(String[] args) {
    String idCard = "3689232519900576666";
    boolean b = validateCard(idCard);
    String province = getProvinceByIdCard(idCard);
    String city = getCitycodeByIdCard(idCard);
    int year = getYearByIdCard(idCard);
    int month = getMonthByIdCard(idCard);
    int date = getDateByIdCard(idCard);
    int age = getAgeByIdCard(idCard);
    String gender = getGenderByIdCard(idCard);
    System.out.println("身份证号：" + idCard);
    System.out.println("是否合法：" + b);
    System.out.println("省：" + province);
    System.out.println("城市编码：" + city);
    System.out.println("年：" + year);
    System.out.println("月：" + month);
    System.out.println("日：" + date);
    System.out.println("年龄：" + age);
    System.out.println("性别：" + gender);
}
```

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.replace;
import static org.apache.commons.lang3.StringUtils.substring;
import static org.apache.commons.lang3.time.DateFormatUtils.ISO_DATE_FORMAT;

/**
 * 身份证工具类
 * 验证18位身份号码是否合法
 * 验证15位身份号码是否合法
 * 验证台湾身份证号码是否合法
 * 验证香港身份证号码是否合法
 * 解析身份证号获取户籍城市编码，出生日期，性别
 */
public class IdcardUtils {
    /**
     * 中国公民身份证号码最小长度。
     */
    public static final int CHINA_ID_MIN_LENGTH = 15;

    /**
     * 中国公民身份证号码最大长度。
     */
    public static final int CHINA_ID_MAX_LENGTH = 18;

    /**
     * 省、直辖市代码表
     */
    public static final String cityCode[] = {"11", "12", "13", "14", "15", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "41", "42", "43", "44", "45", "46", "50",
            "51", "52", "53", "54", "61", "62", "63", "64", "65", "71", "81", "82", "91"};

    /**
     * 每位加权因子
     */
    public static final int power[] = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};

    /**
     * 第18位校检码
     */
    public static final String verifyCode[] = {"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"};
    /**
     * 最低年限
     */
    public static final int MIN = 1900;
    public static Map<String, String> cityCodes = new HashMap<String, String>();

    /**
     * 台湾身份首字母对应数字
     */
    public static Map<String, Integer> twFirstCode = new HashMap<String, Integer>();
    /**
     * 香港身份首字母对应数字
     */
    public static Map<String, Integer> hkFirstCode = new HashMap<String, Integer>();

    static {
        cityCodes.put("11", "北京");
        cityCodes.put("12", "天津");
        cityCodes.put("13", "河北");
        cityCodes.put("14", "山西");
        cityCodes.put("15", "内蒙古");
        cityCodes.put("21", "辽宁");
        cityCodes.put("22", "吉林");
        cityCodes.put("23", "黑龙江");
        cityCodes.put("31", "上海");
        cityCodes.put("32", "江苏");
        cityCodes.put("33", "浙江");
        cityCodes.put("34", "安徽");
        cityCodes.put("35", "福建");
        cityCodes.put("36", "江西");
        cityCodes.put("37", "山东");
        cityCodes.put("41", "河南");
        cityCodes.put("42", "湖北");
        cityCodes.put("43", "湖南");
        cityCodes.put("44", "广东");
        cityCodes.put("45", "广西");
        cityCodes.put("46", "海南");
        cityCodes.put("50", "重庆");
        cityCodes.put("51", "四川");
        cityCodes.put("52", "贵州");
        cityCodes.put("53", "云南");
        cityCodes.put("54", "西藏");
        cityCodes.put("61", "陕西");
        cityCodes.put("62", "甘肃");
        cityCodes.put("63", "青海");
        cityCodes.put("64", "宁夏");
        cityCodes.put("65", "新疆");
        cityCodes.put("71", "台湾");
        cityCodes.put("81", "香港");
        cityCodes.put("82", "澳门");
        cityCodes.put("91", "国外");
        twFirstCode.put("A", 10);
        twFirstCode.put("B", 11);
        twFirstCode.put("C", 12);
        twFirstCode.put("D", 13);
        twFirstCode.put("E", 14);
        twFirstCode.put("F", 15);
        twFirstCode.put("G", 16);
        twFirstCode.put("H", 17);
        twFirstCode.put("J", 18);
        twFirstCode.put("K", 19);
        twFirstCode.put("L", 20);
        twFirstCode.put("M", 21);
        twFirstCode.put("N", 22);
        twFirstCode.put("P", 23);
        twFirstCode.put("Q", 24);
        twFirstCode.put("R", 25);
        twFirstCode.put("S", 26);
        twFirstCode.put("T", 27);
        twFirstCode.put("U", 28);
        twFirstCode.put("V", 29);
        twFirstCode.put("X", 30);
        twFirstCode.put("Y", 31);
        twFirstCode.put("W", 32);
        twFirstCode.put("Z", 33);
        twFirstCode.put("I", 34);
        twFirstCode.put("O", 35);
        hkFirstCode.put("A", 1);
        hkFirstCode.put("B", 2);
        hkFirstCode.put("C", 3);
        hkFirstCode.put("R", 18);
        hkFirstCode.put("U", 21);
        hkFirstCode.put("Z", 26);
        hkFirstCode.put("X", 24);
        hkFirstCode.put("W", 23);
        hkFirstCode.put("O", 15);
        hkFirstCode.put("N", 14);
    }

    /**
     * 将15位身份证号码转换为18位
     *
     * @param idCard 15位身份编码
     * @return 18位身份编码
     */
    private static String conver15CardTo18(String idCard) {
        String idCard18 = "";
        if (idCard.length() != CHINA_ID_MIN_LENGTH) {
            return null;
        }
        if (isNum(idCard)) {
            // 获取出生年月日
            String birthday = idCard.substring(6, 12);
            Date birthDate = null;
            try {
                birthDate = new SimpleDateFormat("yyMMdd").parse(birthday);
            } catch (ParseException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            Calendar cal = Calendar.getInstance();
            if (birthDate != null)
                cal.setTime(birthDate);
            // 获取出生年(完全表现形式,如：2010)
            String sYear = String.valueOf(cal.get(Calendar.YEAR));
            idCard18 = idCard.substring(0, 6) + sYear + idCard.substring(8);
            // 转换字符数组
            char[] cArr = idCard18.toCharArray();
            if (cArr != null) {
                int[] iCard = converCharToInt(cArr);
                int iSum17 = getPowerSum(iCard);
                // 获取校验位
                String sVal = getCheckCode18(iSum17);
                if (sVal.length() > 0) {
                    idCard18 += sVal;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
        return idCard18;
    }

    /**
     * 验证身份证是否合法
     */
    public static boolean validateCard(String idCard) {
        String card = idCard.trim();
        if (validateIdCard18(card)) {
            return true;
        }
        if (validateIdCard15(card)) {
            return true;
        }
        String[] cardval = validateIdCard10(card);
        if (cardval != null) {
            if ("true".equals(cardval[2])) {
                return true;
            }
        }
        return false;
    }

    /**
     * 验证18位身份编码是否合法
     *
     * @param idCard 身份编码
     * @return 是否合法
     */
    public static boolean validateIdCard18(String idCard) {
        boolean bTrue = false;
        if (idCard.length() == CHINA_ID_MAX_LENGTH) {
            // 前17位
            String code17 = idCard.substring(0, 17);
            // 第18位
            String code18 = idCard.substring(17, CHINA_ID_MAX_LENGTH);
            if (isNum(code17)) {
                char[] cArr = code17.toCharArray();
                if (cArr != null) {
                    int[] iCard = converCharToInt(cArr);
                    int iSum17 = getPowerSum(iCard);
                    // 获取校验位
                    String val = getCheckCode18(iSum17);
                    if (val.length() > 0) {
                        if (val.equalsIgnoreCase(code18)) {
                            bTrue = true;
                        }
                    }
                }
            }
        }
        return bTrue;
    }

    /**
     * 验证15位身份编码是否合法
     *
     * @param idCard 身份编码
     * @return 是否合法
     */
    public static boolean validateIdCard15(String idCard) {
        if (idCard.length() != CHINA_ID_MIN_LENGTH) {
            return false;
        }
        if (isNum(idCard)) {
            String proCode = idCard.substring(0, 2);
            if (cityCodes.get(proCode) == null) {
                return false;
            }
            String birthCode = idCard.substring(6, 12);
            Date birthDate = null;
            try {
                birthDate = new SimpleDateFormat("yy").parse(birthCode.substring(0, 2));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            Calendar cal = Calendar.getInstance();
            if (birthDate != null)
                cal.setTime(birthDate);
            if (!valiDate(cal.get(Calendar.YEAR), Integer.valueOf(birthCode.substring(2, 4)), Integer.valueOf(birthCode.substring(4, 6)))) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    /**
     * 验证10位身份编码是否合法
     *
     * @param idCard 身份编码
     * @return 身份证信息数组
     * <p>
     * [0] - 台湾、澳门、香港 [1] - 性别(男M,女F,未知N) [2] - 是否合法(合法true,不合法false)
     * 若不是身份证件号码则返回null
     * </p>
     */
    public static String[] validateIdCard10(String idCard) {
        String[] info = new String[3];
        String card = idCard.replaceAll("[\\(|\\)]", "");
        if (card.length() != 8 && card.length() != 9 && idCard.length() != 10) {
            return null;
        }
        if (idCard.matches("^[a-zA-Z][0-9]{9}$")) { // 台湾
            info[0] = "台湾";
            String char2 = idCard.substring(1, 2);
            if (char2.equals("1")) {
                info[1] = "M";
            } else if (char2.equals("2")) {
                info[1] = "F";
            } else {
                info[1] = "N";
                info[2] = "false";
                return info;
            }
            info[2] = validateTWCard(idCard) ? "true" : "false";
        } else if (idCard.matches("^[1|5|7][0-9]{6}\\(?[0-9A-Z]\\)?$")) { // 澳门
            info[0] = "澳门";
            info[1] = "N";
            // TODO
        } else if (idCard.matches("^[A-Z]{1,2}[0-9]{6}\\(?[0-9A]\\)?$")) { // 香港
            info[0] = "香港";
            info[1] = "N";
            info[2] = validateHKCard(idCard) ? "true" : "false";
        } else {
            return null;
        }
        return info;
    }

    /**
     * 验证台湾身份证号码
     *
     * @param idCard 身份证号码
     * @return 验证码是否符合
     */
    public static boolean validateTWCard(String idCard) {
        String start = idCard.substring(0, 1);
        String mid = idCard.substring(1, 9);
        String end = idCard.substring(9, 10);
        Integer iStart = twFirstCode.get(start);
        Integer sum = iStart / 10 + (iStart % 10) * 9;
        char[] chars = mid.toCharArray();
        Integer iflag = 8;
        for (char c : chars) {
            sum = sum + Integer.valueOf(c + "") * iflag;
            iflag--;
        }
        return (sum % 10 == 0 ? 0 : (10 - sum % 10)) == Integer.valueOf(end) ? true : false;
    }

    /**
     * 验证香港身份证号码
     * <p>
     * 身份证前2位为英文字符，如果只出现一个英文字符则表示第一位是空格，对应数字58 前2位英文字符A-Z分别对应数字10-35
     * 最后一位校验码为0-9的数字加上字符"A"，"A"代表10
     * </p>
     * <p>
     * 将身份证号码全部转换为数字，分别对应乘9-1相加的总和，整除11则证件号码有效
     * </p>
     *
     * @param idCard 身份证号码
     * @return 验证码是否符合
     */
    public static boolean validateHKCard(String idCard) {
        String card = idCard.replaceAll("[\\(|\\)]", "");
        Integer sum = 0;
        if (card.length() == 9) {
            sum = (Integer.valueOf(card.substring(0, 1).toUpperCase().toCharArray()[0]) - 55) * 9 + (Integer.valueOf(card.substring(1, 2).toUpperCase().toCharArray()[0]) - 55) * 8;
            card = card.substring(1, 9);
        } else {
            sum = 522 + (Integer.valueOf(card.substring(0, 1).toUpperCase().toCharArray()[0]) - 55) * 8;
        }
        String mid = card.substring(1, 7);
        String end = card.substring(7, 8);
        char[] chars = mid.toCharArray();
        Integer iflag = 7;
        for (char c : chars) {
            sum = sum + Integer.valueOf(c + "") * iflag;
            iflag--;
        }
        if (end.toUpperCase().equals("A")) {
            sum = sum + 10;
        } else {
            sum = sum + Integer.valueOf(end);
        }
        return (sum % 11 == 0) ? true : false;
    }

    /**
     * 将字符数组转换成数字数组
     *
     * @param ca 字符数组
     * @return 数字数组
     */
    private static int[] converCharToInt(char[] ca) {
        int len = ca.length;
        int[] iArr = new int[len];
        try {
            for (int i = 0; i < len; i++) {
                iArr[i] = Integer.parseInt(String.valueOf(ca[i]));
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return iArr;
    }

    /**
     * 将身份证的每位和对应位的加权因子相乘之后，再得到和值
     *
     * @param iArr
     * @return 身份证编码。
     */
    private static int getPowerSum(int[] iArr) {
        int iSum = 0;
        if (power.length == iArr.length) {
            for (int i = 0; i < iArr.length; i++) {
                for (int j = 0; j < power.length; j++) {
                    if (i == j) {
                        iSum = iSum + iArr[i] * power[j];
                    }
                }
            }
        }
        return iSum;
    }

    /**
     * 将power和值与11取模获得余数进行校验码判断
     *
     * @param iSum
     * @return 校验位
     */
    private static String getCheckCode18(int iSum) {
        String sCode = "";
        switch (iSum % 11) {
            case 10:
                sCode = "2";
                break;
            case 9:
                sCode = "3";
                break;
            case 8:
                sCode = "4";
                break;
            case 7:
                sCode = "5";
                break;
            case 6:
                sCode = "6";
                break;
            case 5:
                sCode = "7";
                break;
            case 4:
                sCode = "8";
                break;
            case 3:
                sCode = "9";
                break;
            case 2:
                sCode = "x";
                break;
            case 1:
                sCode = "0";
                break;
            case 0:
                sCode = "1";
                break;
        }
        return sCode;
    }

    /**
     * 根据身份编号获取年龄
     *
     * @param idCard 身份编号
     * @return 年龄
     */
    public static int getAgeByIdCard(String idCard) {
        int iAge = 0;
        if (idCard.length() == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        String year = idCard.substring(6, 10);
        Calendar cal = Calendar.getInstance();
        int iCurrYear = cal.get(Calendar.YEAR);
        iAge = iCurrYear - Integer.valueOf(year);
        return iAge;
    }

    /**
     * 根据生日判断是否年满18周岁
     *
     * @param idCard
     * @return
     */
    public static boolean is18YearsOld(String idCard) {
        int iAge = getAgeByIdCard(idCard);
        return iAge > 18 ? true : (iAge < 18 ? false : substring(replace(ISO_DATE_FORMAT.format(Calendar.getInstance()), "-", ""), 4).compareTo(
                substring(getBirthByIdCard(idCard), 4)) >= 0);
    }

    /**
     * 根据身份编号获取生日
     *
     * @param idCard 身份编号
     * @return 生日(yyyyMMdd)
     */
    public static String getBirthByIdCard(String idCard) {
        Integer len = idCard.length();
        if (len < CHINA_ID_MIN_LENGTH) {
            return null;
        } else if (len == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        return idCard.substring(6, 14);
    }

    /**
     * 根据身份编号获取生日年
     *
     * @param idCard 身份编号
     * @return 生日(yyyy)
     */
    public static Short getYearByIdCard(String idCard) {
        Integer len = idCard.length();
        if (len < CHINA_ID_MIN_LENGTH) {
            return null;
        } else if (len == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        return Short.valueOf(idCard.substring(6, 10));
    }

    /**
     * 根据身份编号获取生日月
     *
     * @param idCard 身份编号
     * @return 生日(MM)
     */
    public static Short getMonthByIdCard(String idCard) {
        Integer len = idCard.length();
        if (len < CHINA_ID_MIN_LENGTH) {
            return null;
        } else if (len == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        return Short.valueOf(idCard.substring(10, 12));
    }

    /**
     * 根据身份编号获取生日天
     *
     * @param idCard 身份编号
     * @return 生日(dd)
     */
    public static Short getDateByIdCard(String idCard) {
        Integer len = idCard.length();
        if (len < CHINA_ID_MIN_LENGTH) {
            return null;
        } else if (len == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        return Short.valueOf(idCard.substring(12, 14));
    }

    /**
     * 根据身份编号获取性别
     *
     * @param idCard 身份编号
     * @return 性别(M - 男 ， F - 女 ， N - 未知)
     */
    public static String getGenderByIdCard(String idCard) {
        String sGender = "N";
        if (idCard.length() == CHINA_ID_MIN_LENGTH) {
            idCard = conver15CardTo18(idCard);
        }
        String sCardNum = idCard.substring(16, 17);
        if (Integer.parseInt(sCardNum) % 2 != 0) {
            sGender = "男";
        } else {
            sGender = "女";
        }
        return sGender;
    }

    /**
     * 根据身份编号获取户籍省份
     *
     * @param idCard 身份编码
     * @return 省级编码。
     */
    public static String getProvinceByIdCard(String idCard) {
        int len = idCard.length();
        String sProvince = null;
        String sProvinNum = "";
        if (len == CHINA_ID_MIN_LENGTH || len == CHINA_ID_MAX_LENGTH) {
            sProvinNum = idCard.substring(0, 2);
        }
        sProvince = cityCodes.get(sProvinNum);
        return sProvince;
    }

    /**
     * 根据身份编号获取户籍城市编码
     *
     * @param idCard 身份编码
     * @return 城市编码。
     */
    public static String getCitycodeByIdCard(String idCard) {
        return idCard.substring(0, 6);
    }

    /**
     * 数字验证
     *
     * @param val
     * @return 提取的数字。
     */
    private static boolean isNum(String val) {
        return val == null || "".equals(val) ? false : val.matches("^[0-9]*$");
    }

    /**
     * 验证小于当前日期 是否有效
     *
     * @param iYear  待验证日期(年)
     * @param iMonth 待验证日期(月 1-12)
     * @param iDate  待验证日期(日)
     * @return 是否有效
     */
    private static boolean valiDate(int iYear, int iMonth, int iDate) {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int datePerMonth;
        if (iYear < MIN || iYear >= year) {
            return false;
        }
        if (iMonth < 1 || iMonth > 12) {
            return false;
        }
        switch (iMonth) {
            case 4:
            case 6:
            case 9:
            case 11:
                datePerMonth = 30;
                break;
            case 2:
                boolean dm = ((iYear % 4 == 0 && iYear % 100 != 0) || (iYear % 400 == 0)) && (iYear > MIN && iYear < year);
                datePerMonth = dm ? 29 : 28;
                break;
            default:
                datePerMonth = 31;
        }
        return (iDate >= 1) && (iDate <= datePerMonth);
    }
}
```

### 解析IP

```java
package io.easy.common.utils;

import com.alibaba.druid.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * IP地址
 */
public class IPUtils {
   private static Logger logger = LoggerFactory.getLogger(IPUtils.class);

   /**
    * 获取IP地址
    * 
    * 使用Nginx等反向代理软件， 则不能通过request.getRemoteAddr()获取IP地址
    * 如果使用了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP地址，X-Forwarded-For中第一个非unknown的有效IP字符串，则为真实IP地址
    */
   public static String getIpAddr(HttpServletRequest request) {
       String ip = null;
        try {
            ip = request.getHeader("x-forwarded-for");
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (StringUtils.isEmpty(ip) || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
        } catch (Exception e) {
           logger.error("IPUtils ERROR ", e);
        }
        
//        //使用代理，则获取第一个IP地址
//        if(StringUtils.isEmpty(ip) && ip.length() > 15) {
//       if(ip.indexOf(",") > 0) {
//          ip = ip.substring(0, ip.indexOf(","));
//       }
//    }
        return ip;
    }
   
}
```

## 其他

### Redis

```java
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Redis工具类
 */
@Component
public class RedisUtils {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ValueOperations<String, String> valueOperations;
    @Autowired
    private HashOperations<String, String, Object> hashOperations;
    @Autowired
    private ListOperations<String, Object> listOperations;
    @Autowired
    private SetOperations<String, Object> setOperations;
    @Autowired
    private ZSetOperations<String, Object> zSetOperations;
    /**  默认过期时长，单位：秒 */
    public final static long DEFAULT_EXPIRE = 60 * 60 * 24;
    /**  不设置过期时长 */
    public final static long NOT_EXPIRE = -1;
    private final static Gson gson = new Gson();

    public void set(String key, Object value, long expire){
        valueOperations.set(key, toJson(value));
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
    }

    public void set(String key, Object value){
        set(key, value, DEFAULT_EXPIRE);
    }

    public <T> T get(String key, Class<T> clazz, long expire) {
        String value = valueOperations.get(key);
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
        return value == null ? null : fromJson(value, clazz);
    }

    public <T> T get(String key, Class<T> clazz) {
        return get(key, clazz, NOT_EXPIRE);
    }

    public String get(String key, long expire) {
        String value = valueOperations.get(key);
        if(expire != NOT_EXPIRE){
            redisTemplate.expire(key, expire, TimeUnit.SECONDS);
        }
        return value;
    }

    public String get(String key) {
        return get(key, NOT_EXPIRE);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    /**
     * Object转成JSON数据
     */
    private String toJson(Object object){
        if(object instanceof Integer || object instanceof Long || object instanceof Float ||
                object instanceof Double || object instanceof Boolean || object instanceof String){
            return String.valueOf(object);
        }
        return gson.toJson(object);
    }

    /**
     * JSON数据，转成Object
     */
    private <T> T fromJson(String json, Class<T> clazz){
        return gson.fromJson(json, clazz);
    }
}
```

### SMS

```java
import com.alibaba.fastjson.JSON;
import io.easy.modules.sys.entity.SysSmsLogEntity;
import io.easy.modules.sys.entity.SysSmsResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SMSUtils {

    private static Logger _logger = LoggerFactory.getLogger(SMSUtils.class);
    public enum SmsConfigType{
        SEND_CODE(1), CHECK_CODE(2), SEND_SMS(3);
        private int index ;
        public int getIndex() {
            return index;
        }
        private SmsConfigType( int index ){
            this.index = index ;
        }
    }

    /**
     * 发送短信消息
     * @param apiFormat API地址格式
     * @param phone 手机号码
     * @return 响应结果
     */
    public static SysSmsLogEntity sendSMSCode(String apiFormat, String phone) {
        phone = StringUtils.replaceBlank(phone);
        if(StringUtils.isBlank(phone)) {
            return null;
        }
        // 构建用于替换字典
        Map<String, String> matchReplaceList = new HashMap<String, String>();
        matchReplaceList.put("param1", phone);
        String url = StringUtils.parseString(apiFormat, matchReplaceList);
        String res = HttpUtils.doGet(url);
        // [{"code":"00","sId":"2015072231000100000065"}]
        List<SysSmsLogEntity> source = JSON.parseArray(res, SysSmsLogEntity.class);
        if (source != null && source.size() > 0) {
            SysSmsLogEntity result = source.get(0);
            result.setCallUrl(url);
            result.setMobile(phone);
            return result;
        }
        return null;
    }

    /**
     * 校验短信验证码
     * @param apiFormat API地址格式
     * @param phone 手机号
     * @param smsCode 验证码
     * @return 响应结果
     */
    public static SysSmsLogEntity checkSMSCode(String apiFormat, String phone, String smsCode) {
        phone = StringUtils.replaceBlank(phone);
        smsCode = StringUtils.replaceBlank(smsCode);
        if(StringUtils.isBlank(phone)) {
            return null;
        }
        //http://120.197.89.93:80/EOPS1.0/captcha/auth/手机号码;callerId=param2;password=param3;randomCode=param4
        Map<String, String> matchReplaceList = new HashMap<String, String>();
        matchReplaceList.put("param1", phone);
        matchReplaceList.put("param4", smsCode);
        String url = StringUtils.parseString(apiFormat, matchReplaceList);
        String res = HttpUtils.doGet(url);
        SysSmsLogEntity result = new SysSmsLogEntity();
        result.setCode(res);
        result.setCallUrl(url);
        result.setMobile(phone);
        return result;
    }


    /**
     * 发送单条模版短信
     * @param apiUrl 请求地址
     * @param requestParams 请求参数
     * @param phone 手机号码
     * @return 处理过结果
     * @throws IOException
     */
    public static SysSmsLogEntity sendSMS(String apiUrl, Map<String, String> requestParams, String phone) throws IOException {
        phone = StringUtils.replaceBlank(phone);
        if(StringUtils.isBlank(phone)) {
            return null;
        }
        String res = HttpUtils.sendSMS2(apiUrl, requestParams);
        // [{"code":"00","sId":"2015072231000100000065"}]
        List<SysSmsLogEntity> source = JSON.parseArray(res, SysSmsLogEntity.class);
        if (source != null && source.size() > 0) {
            SysSmsLogEntity result = source.get(0);
            result.setCallUrl(apiUrl);
            result.setMobile(phone);
            return result;
        }
        return null;
    }

    /**
     * 处理验证码结果
     * @param smsResponseEntityList 配置列表
     * @param code 短信响应code
     * @param configId 选定配置Id
     * @return 响应结果
     */
    public static SysSmsResponseEntity handleCodeResult(List<SysSmsResponseEntity> smsResponseEntityList, String code, int configId) {
        for (SysSmsResponseEntity sysSmsResponseEntity: smsResponseEntityList) {
            if (sysSmsResponseEntity.getCode().equals(code) && sysSmsResponseEntity.getConfigId() == configId) {
                return sysSmsResponseEntity;
            }
        }
        SysSmsResponseEntity responseEntity = new SysSmsResponseEntity();
        responseEntity.setCode(code);
        responseEntity.setStatus(0);
        responseEntity.setMsg("未知原因");
        return responseEntity;
    }

    /**
     * 随机生成6位随机验证码
     * 方法说明
     */
    public static String createRandomVcode(){
        //验证码
        String vcode = "";
        for (int i = 0; i < 6; i++) {
            vcode = vcode + (int)(Math.random() * 9);
        }
        return vcode;
    }

```




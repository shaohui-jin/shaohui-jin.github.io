---
title: 服务器
lang: zh-CN
date: 2022-05-16 11:21:30
permalink: /Promotion/Server/
category: 
  - 服务器
tag: 
  - 服务器
---

## 远程连接问题

![](https://shaohui-jin.github.io/picx-images-hosting/blog/Linux/001.231mqnozjx.webp " " =800x)

修改登录客户端，即本地计算机的设置。
运行gpedit.msc打开本地组策略编辑器，依次展开“计算机配置”->“管理模板”->“系统”->“凭据分配”，选择设置项： 加密 Oracle 修正
然后右键编辑，改为 启用，保护级别为 易受攻击，确定。设置完成后即可正常远程。


## 查看网卡配置
```shell script
cd /etc/sysconfig/network-scripts/
```

### 按时间显示文件
```shell script
ls -lrt
```

### 查看具体网卡信息
```shell script
ifconfig -a｜more
```

### 查看eth0的配置
```shell script
vi ifcfg-eth0
```

## 配置IP、子网掩码、网关

### 重启网卡
```shell script
service network restart
```

## 配置
```shell script
BOOTPROTO=static        
#static静态、dhcp动态获取、none不指定（可能出现问题）

ONBOOT=yes              
#特别注意 这个是开机启动,需要设置成yes

DNS1=8.8.8.8            
#DNS域名解析服务器的IP地址

IPADDR=192.168.1.2      
#网卡的IP地址

GATEWAY=192.168.1.1     
#网关地址

NETMASK=255.255.255.0   
#子网掩码
```

## 配置文件
```shell script
DEVICE=ens33                         
# 网卡的设备名称

NAME=ens33                           
# 网卡设备的别名

TYPE=Ethernet                        
# 网络类型：Ethernet以太网

BOOTPROTO=none                       
#引导协议：static静态、dhcp动态获取、none不指定（可能出现问题）

DEFROUTE=yes                         
# 启动默认路由

IPV4_FAILURE_FATAL=no                
# 不启用IPV4错误检测功能

IPV6INIT=yes                         
# 启用IPV6协议

IPV6_AUTOCONF=yes                    
# 自动配置IPV6地址

IPV6_DEFROUTE=yes                    
# 启用IPV6默认路由

IPV6_FAILURE_FATAL=no                
# 不启用IPV6错误检测功能

UUID=sjdfga-asfd-asdf-asdf-f82b      
# 网卡设备的UUID唯一标识号

ONBOOT=yes                           
# 开机自动启动网卡

DNS=114.114.114.114                  
# DNS域名解析服务器的IP地址 可以多设置一个DNS1

IPADDR=192.168.1.22                  
# 网卡的IP地址

PREFIX=24                            
# 子网前缀长度

GATEWAY=192.168.1.1                  
# 默认网关IP地址

IPV6_PEERDNS=yes
IPV6_PEERROUTES=yes
IPADDR=192.168.1.22                  
# 你想要设置的固定IP，理论上192.168.2.2-255之间都可以，请自行验证；如果是dhcp可以不填写

NETMASK=255.255.255.0                
# 子网掩码，不需要修改；
```

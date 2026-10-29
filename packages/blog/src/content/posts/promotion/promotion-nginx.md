---
title: Nginx
lang: zh-CN
date: 2023-06-20 10:04:14
permalink: /Promotion/Nginx/
category:
  - nginx
tag:
  - nginx
---

### Nginx的特性

- 模块化设计、较好扩展性

但不支持动态模块加载，编译时启用的模块在nginx启动时会全部加载；1.9.11部分模块支持DSO

- 高可靠性

master进程负责管理 worker进程的崩溃不会相互影响

- 低内存消耗

10000个keep-alive连接在nginx仅消耗2.5MB

- 支持热部署

不停机而更新配置文件、更换日志文件、更新服务器程序版本

#### 基本HTTP功能

- 提供静态文件和index文件，生成自动索引，缓存打开文件的描述符；
- 使用缓存加快反向代理和FastCGI访问；
- 模块化结构，过滤器包括gzip，字节range，chunk响应，XSLT，SSI(Server Side Include)，图像大小调；整，被传到后台服务器的多个SSI指令在单个页面并行处理；
- 支持SSL和TLS SNI；

#### 其他HTTP功能

- 基于名称和IP的虚拟服务器；
- 基于客户端IP和HTTP基本认证的访问控制；
- 支持keepalive和管道连接；
- 平滑的重新配置和在线升级；
- 定制访问日志格式，缓存日志写入和快速日志轮询；
- 3xx-5xx错误重定向，定制错误页面；
- 支持url rewrite；
- FLV流文件；
- 速度限制；
- 限制同时连接数或者来自同一个IP地址的请求；

#### 邮件代理服务器

#### 架构和可扩展性

- 一个主进程和多个工作进程，工作进程以非特权用户运行；
  主进程必须以管理员身份启动（启动<1023端口必须使用管理员身份），主进程用来监控和管理工作进程；主进程加载配置文件后，若有错误，不会影响工作进程；重新再加载正确后，新的连接建立时使用新配置。

- 支持的事件机制的IO框架
  kqueue（FreeBSD 4.1+）、epoll（Linux 2.6+）、rt signals（Linux 2.2.19+）、/dev/poll（Solaris 7 11/99+）、event ports（Solaris 10）、select以及poll（次之）；
  众多支持的kqueue特性包括EV_CLEAR、EV_DISABLE（临时禁止事件）、NOTE_LOWAT、EV_EOF，可用数据的数量，错误代码；
- 支持sendfile（FreeBSD 3.1+, Linux 2.2+, Mac OS X 10.5+）、sendfile64（Linux 2.4.21+）和sendfilev（Solaris 8 7/01+）；
  用户请求响应不经过用户空间，报文在内核完成http封装直接从内核响应给客户端，避免了响应报文从内核复制到用户空间，再从用户空间复制到内核空间在响应给客户，尽可能避免数据拷贝操作。
- 文件AIO（FreeBSD 4.3+, Linux 2.6.22+）；
- DIRECTIO (FreeBSD 4.4+, Linux 2.4+, Solaris 2.6+, Mac OS X);
- 支持Accept-filters（FreeBSD 4.1+, NetBSD 5.0+）和 TCP_DEFER_ACCEPT（Linux 2.4+）；
- 支持连接过滤器，限制连接数
- 10000个非活跃的HTTP keep-alive连接仅占用约2.5M内存；

#### 模块类型
- 核心模块
- Standard HTTP modules 标准http模块
- Optional HTTP modules 可选http模块
- Mail modules 邮件模块
- 3rd party modules 第三方模块


### Nginx常用变量

```shell
$args                  ## URL中的查询字符串，如 http://example1.com/?foo=123&bar=blahblah中的foo=123&bar=blahblah
$binary_remote_addr    ## 二进制形式的IP，节省空间.
$body_bytes_sent       ## 发送的body字节数.
$content_length        ## HTTP请求信息里的 Content-Length;
$content_type          ## HTTP请求信息里的 Content-type

$document_root         ## 当前请求的目录
$document_uri          ## 同 $uri.
$uri                   ## 请求的 URI，可能和最初的值有不同，比如经过重定向之类的
$host                  ## 请求的主机
$http_HEADER           ## 请求头
$request_uri           ## 请求的原始URI
$server_addr           ## 服务器地址
$server_name           ## 服务器名称
$server_port           ## 服务器的端口
$server_protocol       ## 通常是 HTTP/1.0 或者 HTTP/1.1.
$upstream_cache_status ## 缓存是否命中
```


### Nginx内核模块


内核模块用于控制 **Nginx服务器** 的基本功能，内核参数的修改需要重新启动nginx才能生效？？？

#### 用于调试进程，定位问题的配置项

##### daemon

::: info 是否以 守护进程 方式启动nginx

```text
语法： daemon on|off;
默认： daemon on;
```

**守护进程（daemon）** 是 **脱离终端** 并且在 **后台运行** 的进程。
它脱离终端是为了避免进程执行过程中的信息在任何终端上显示，这样一来，进程也不会被任何终端所产生的信息所打断。
`nginx毫无疑问是一个需要以守护进程方式运行的服务`，因此，**默认** 都是以这种方式运行的。
不过 nginx 还是提供了 **关闭** 守护进程的模式，之所以提供这种模式，是为了 **方便跟踪调试nginx**，毕竟用 **gdb**^Linux常用的程序调试器^ 调试进程时最烦琐的就是`如何继续跟进fork出的子进程`了。

:::

##### master_process 

::: info 是否以 master/worker 方式工作
- on时（默认），以 **master/worker** 进程运行
- off时，以 **master** 进程运行

```text
语法：master_process on|off;
默认：master_process on;
```

默认 nginx 是以 **一个master进程** 管理 **多个 worker进程** 的方式运行的，几乎所有的产品环境下，nginx都以这种方式工作。

与daemon配置相同，提供 **master_process** 配置也是为了 **方便跟踪调试nginx**。如果用 **关闭** 了 **master_process** 方式，就不会 fork 出 worker子进程 来处理请求，而是用 **master进程** 自身来处理请求。

:::

##### error_log 

::: info 日志文件配置

```text
语法： error_log /path/to/file level;
默认： error_log logs/error.log error;
关闭： error_log /dev/null;
```

**path/to/file** 参数可以是一个具体的文件

- 默认情况下是 **logs/error.log** 文件，最好将它放到一个磁盘空间足够大的位置
- 可以是 **/dev/null**，这样就不会输出任何日志了，这也是关闭 **error日志** 的 **唯一手段**
- 可以是 **stderr**，这样日志会输出到 **标准错误文件**

**level** 是日志的输出级别

- 取值范围是 `debug`、`info`、`notice`、`warn`、`error`、`crit`、`alert`、`emerg`，从左至右级别依次增大
- 如果日志级别设定到 **debug**，必须在 configure 时加入 **-–with-debug** 配置项

:::

##### debug_points 

::: info 是否处理几个特殊的调试点

```text
语法： debug_points [stop|abort]
```

该指令用于 nginx 调试，可用来帮助用户调试nginx。**debug_points** 接收2个参数，分别为：**stop** 和 **abort**。

nginx 在一些关键的错误逻辑中（nginx 1.0.14版本中有8处）设置了调试点。如果设置为 **stop**，那么 nginx 的代码执行到这些调试点时，会发出 **SIGSTOP** 信号。如果设置为 **abort**，则会产生一个 **coredump** 文件，可以使用gdb来查看nginx当时的各种信息。

:::

##### debug_connection

::: info 仅对指定的客户端输出debug级别的日志

```text
语法： debug_connection [IP|CIDR]
```

这个配置项实际上属于 **事件类** 配置，因此，它必须放在 **events{...}** 中才有效。它的值可以是 **IP地址** 或 **CIDR地址** ，例如：

```text
events {
  debug_connection 10.224.66.14;
  debug_connection 10.224.57.0/24;
}
```

这样，仅仅来自以上 **IP地址** 的请求才会输出 **debug级别** 的日志，其他请求仍然沿用 **error_log** 中配置的日志级别。`上面这个配置对修复Bug很有用，特别是定位高并发请求下才会发生的问题。`

使用 **debug_connection** 前，需确保在执行 **configure** 时已经加入了 **--with-debug** 参数，否则不会生效。

:::

##### worker_rlimit_core

::: info 限制 coredump 核心转储文件的大小

```text
语法： worker_rlimit_core size
```

在Linux系统中，当进程 **发生错误** 或 **收到信号** 而终止时，系统会将进程执行时的内存内容（**核心映像**）写入一个文件（**core文件**），以作为调试之用，这就是所谓的 **核心转储（core dumps）**。

当Nginx进程出现一些 **非法操作（如内存越界）** 导致进程直接被操作系统强制结束时，会 **生成核心转储core文件**，可以从 core 文件获取当时的堆栈、寄存器等信息，从而帮助我们定位问题。

但这种core文件中的许多信息 **不一定是用户需要的**，如果不加以限制，那么可能一个core文件会达到几GB，这样随便 **coredumps** 几次就会把磁盘占满，引发严重问题。

通过 **worker_rlimit_core** 配置可以限制 **core文件** 的大小，从而有效帮助用户定位问题。

:::

##### working_directory

::: info 指定 coredump 文件生成目录

```text
语法： working_directory path
```

worker进程的工作目录。这个配置项的唯一用途就是设置 **coredump** 文件所放置的目录。因此，需确保 worker进程 **有权限** 向 **working_directory** 指定的目录中写入文件。

:::

#### 正常运行的必备配置

##### env

::: info 定义环境变量

```text
语法： env VAR|VAR=VALUE
事例：env TESTPATH=/tmp/;
```

这个配置项可以让用户直接设置 **操作系统** 上的 **环境变量**

:::

##### include 

::: info 嵌入其他配置文件

```text
语法： include /path/to/file;
事例： include mime.types;
事例： include vhost/*.conf;
```

include 配置项 可以将 **其他配置文件** 嵌入到当前的 **nginx.conf** 文件中，
它的参数 既可以是 **绝对路径**，也可以是 **相对路径**（相对于Nginx的配置目录，即nginx.conf所在的目录）。
参数的值可以是一个 **明确的文件名**，也可以是含有 **通配符*的文件名**，同时可以一次嵌入多个配置文件。

:::

##### pid

::: info 指定nginx的pid文件

```text
语法： pid /path/to/pid_file
默认： pid logs/nginx.pid;
```

保存 **master进程ID** 的 pid文件存放路径。

默认与 **configure** 执行时的参数 **–pid-path** 所指定的路径是相同的，也可以随时修改，但应确保 nginx **有权限**在相应的目标中**创建pid文件**，该文件直接影响 nginx 是否可以运行。

:::

##### user 

::: info 指定运行 worker进程 的用户和组

```text
语法： user username [groupname];
默认： user nobody nobody;
```

user用于设置 **master进程** 启动后，fork出的 **worker进程** 运行在哪个用户和用户组下。当按照 **`user username;`** 设置时，**用户组名** 与 **用户名** 相同。

若用户在 configure 命令执行时使用了参数 **`–user=username`** 和 **`–group=groupname`** ，此时 nginx.conf 将使用参数中指定的 **用户** 和 **用户组**。

:::

##### worker_rlimit_nofile

::: info 指定 nginx worker进程 可以打开的最大句柄描述符个数

```text
语法： worker_rlimit_nofile limit;
```

:::

##### worker_rlimit_sigpending

::: info 指定每个用户能够发往worker的信号的数量

```text
语法： worker_rlimit_sigpending limit;
```

设置每个用户发往 nginx 的 **信号队列的大小**。也就是说，当某个用户的信号队列满了，这个用户再发送的信号量会被 **丢掉**

:::

#### 优化性能相关的配置

##### worker_processes

::: info worker线程的个数

```text
语法： worker_processes number;
默认： worker_processes 1;
```

在 master/worker 运行方式下，即 **`master_process on;`** ，定义 **worker进程** 的个数。

通常应该为物理CPU核心个数减1；

worker进程的数量会直接影响性能。

每个 worker进程 都是 **单线程的进程**，它们会调用各个模块以实现多种多样的功能。
如果这些模块确认不会出现阻塞式的调用，那么，有多少CPU内核就应该配置多少个进程；反之，如果有可能出现阻塞式调用，那么需要配置稍多一些的worker进程。

例如，如果业务方面会致使用户请求大量读取本地磁盘上的静态资源文件，而且服务器上的内存较小，以至于大部分的请求访问静态资源文件时都必须读取磁盘（磁头的寻址是缓慢的），而不是内存中的磁盘缓存，那么磁盘I/O调用可能会阻塞住worker进程少量时间，进而导致服务整体性能下降。

多worker进程可以充分利用多核系统架构，但若worker进程的数量多于CPU内核数，那么会增大进程间切换带来的消耗（Linux是抢占式内核）。一般情况下，用户要配置与CPU内核数相等的worker进程，并且使用下面的worker_cpu_affinity配置来绑定CPU内核。

:::

##### worker_cpu_affinity

::: info 绑定Nginx worker进程到指定的CPU内核

```text
语法： worker_cpu_affinity cpumask[cpumask…]
```

为什么要绑定worker进程到指定的CPU内核呢？假定每一个worker进程都是非常繁忙的，如果多个worker进程都在抢同一个CPU，那么这就会出现同步问题。反之，如果每一个worker进程都独享一个CPU，就在内核的调度策略上实现了完全的并发。

例如，如果有4颗CPU内核，就可以进行如下配置：

```text
worker_processes 4;
worker_cpu_affinity 1000 0100 0010 0001;
```

将第1个进程绑定到CPU0/CPU2上,将第2个进程绑定到CPU1/CPU3上,这个对于超线程CPU合适

```text
worker_processes 1
worker_cpu_affinity 0101 1010;
```

注意：worker_cpu_affinity配置仅对Linux操作系统有效。Linux操作系统使用sched_setaffinity()系统调用实现这个功能。

:::

##### ssl_engine

::: info SSL硬件加速

```text
语法： ssl_engine device;
```

如果服务器上有SSL硬件加速设备，那么就可以进行配置以加快SSL协议的处理速度。用户可以使用OpenSSL提供的命令来查看是否有SSL硬件加速设备：
```text
openssl engine -t
```

:::

##### timer_resolution

::: info 系统调用 gettimeofday 的执行频率

```text
语法： timer_resolution t;
```

默认情况下，每次内核的事件调用（如epoll、select、poll、kqueue等）返回时，都会执行一次gettimeofday，实现用内核的时钟来更新Nginx中的缓存时钟。
在早期的Linux内核中，gettimeofday的执行代价不小，因为中间有一次内核态到用户态的内存复制。
当需要降低gettimeofday的调用频率时，可以使用timer_resolution配置。例如，“timer_resolution 100ms；”表示至少每100ms才调用一次gettimeofday。

但在目前的大多数内核中，如x86-64体系架构，gettimeofday只是一次vsyscall，仅仅对共享内存页中的数据做访问，并不是通常的系统调用，代价并不大，一般不必使用这个配置。
而且，如果希望日志文件中每行打印的时间更准确，也可以使用它。

:::

##### worker_priority

::: info Nginx worker进程优先级设置

```text
语法： worker_priority nice;
默认： worker_priority 0;
```

该配置项用于设置Nginx worker进程的nice优先级。

在Linux或其他类UNIX操作系统中，当许多进程都处于可执行状态时，将按照所有进程的优先级来决定本次内核选择哪一个进程执行。
进程所分配的CPU时间片大小也与进程优先级相关，优先级越高，进程分配到的时间片也就越大（例如，在默认配置下，最小的时间片只有5ms，最大的时间片则有800ms）。
这样，优先级高的进程会占有更多的系统资源。

优先级由静态优先级和内核根据进程执行情况所做的动态调整（目前只有±5的调整）共同决定。
nice值是进程的静态优先级，它的取值范围是–20~+19，–20是最高优先级，+19是最低优先级。
因此，如果用户希望Nginx占有更多的系统资源，那么可以把nice值配置得更小一些，但不建议比内核进程的nice值（通常为–5）还要小。

:::

#### 事件类配置项

##### worker_connections

::: info 每个worker的最大连接数

```text
语法： worker_connections number;
```

定义每个worker进程可以同时处理的最大连接数。

:::

##### accept_mutex

::: info 是否打开accept锁

```text
语法： accept_mutex[on|off]
默认： accept_mutext on;
```

accept_mutex是Nginx的负载均衡锁，本书会在第9章事件处理框架中详述Nginx是如何实现负载均衡的。
这里，读者仅需要知道accept_mutex这把锁可以让多个worker进程轮流地、序列化地与新的客户端建立TCP连接。
当某一个worker进程建立的连接数量达到worker_connections配置的最大连接数的7/8时，会大大地减小该worker进程试图建立新TCP连接的机会，
以此实现所有worker进程之上处理的客户端请求数尽量接近。

accept锁默认是打开的，如果关闭它，那么建立TCP连接的耗时会更短，但worker进程之间的负载会非常不均衡，因此不建议关闭它。

:::

##### lock_file

::: info lock文件的路径

```text
语法： lock_file path/file;
默认： lock_file logs/nginx.lock;
```

accept锁可能需要这个lock文件，如果accept锁关闭，lock_file配置完全不生效。
如果打开了accept锁，并且由于编译程序、操作系统架构等因素导致Nginx不支持原子锁，
这时才会用文件锁实现accept锁（14.8.1节将会介绍文件锁的用法），这样lock_file指定的lock文件才会生效。

注意 　在基于i386、AMD64、Sparc64、PPC64体系架构的操作系统上，若使用GCC、Intel C++、SunPro C++编译器来编译Nginx，
则可以肯定这时的Nginx是支持原子锁的，因为Nginx会利用CPU的特性并用汇编语言来实现它（可以参考14.3节x86架构下原子操作的实现）。
这时的lock_file配置是没有意义的。

:::

##### accept_mutex_delay

::: info 使用accept锁后到真正建立连接之间的延迟时间

```text
语法： accept_mutex_delay Nms;
默认： accept_mutex_delay 500ms;
```

在使用accept锁后，同一时间只有一个worker进程能够取到accept锁。
这个accept锁不是阻塞锁，如果取不到会立刻返回。
如果有一个worker进程试图取accept锁而没有取到，它至少要等accept_mutex_delay定义的时间间隔后才能再次试图取锁。

:::

##### multi_accept

::: info 批量建立新连接

```text
语法： multi_accept[on|off];
默认： multi_accept off;
```

当事件模型通知有新连接时，尽可能地对本次调度中客户端发起的所有TCP请求都建立连接。

:::

##### use

::: info 选择事件模型

```text
语法： use[kqueue|rtsig|epoll|/dev/poll|select|poll|eventport];
默认： Nginx会自动使用最适合的事件模型
```

对于Linux操作系统来说，可供选择的事件驱动模型有poll、select、epoll三种。epoll当然是性能最高的一种，在9.6节会解释epoll为什么可以处理大并发连接。

:::






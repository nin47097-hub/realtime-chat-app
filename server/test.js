const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.owmi28b.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.log("DNS Error:");
      console.log(err);
    } else {
      console.log("Success:");
      console.log(addresses);
    }
  }
);
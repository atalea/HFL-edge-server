#!/bin/bash
read -p "Enter Central Serve IP: " IP
PublicIP=$(curl ifconfig.me)
node edge/index.js "${ip}" "${PublicIP}"

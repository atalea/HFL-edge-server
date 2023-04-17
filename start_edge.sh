#!/bin/bash
read -p "Enter Central Server IP: " IP
host=$(curl ifconfig.me)
node edge/index.js "${IP}" "${host}"

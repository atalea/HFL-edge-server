#!/bin/bash
read -p "Enter Port to run on: " port
read -p "Enter central IP: " host
node edge/index.js "$port" "$host"
while true
do
  read -p ""
done

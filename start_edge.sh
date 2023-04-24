#!/bin/bash
read -p "Enter Local IP for edge to run on: " HOST
read -p "Enter Central Server IP: " CENTRAL_SERVER

export HOST
export CENTRAL_SERVER
node edge/index.js
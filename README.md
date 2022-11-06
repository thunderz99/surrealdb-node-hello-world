# surrealdb-node-hello-world
A sample nodejs program to demonstrate how to use surrealdb for a hello world.



## prerequisites

* node 16
* docker

## How to run

```
# at terminal tab1
% docker run --rm -p 8000:8000 surrealdb/surrealdb:latest start --log trace --user root --pass root

# at terminal tab2
% git clone https://github.com/thunderz99/surrealdb-node-hello-world.git
% cd surrealdb-node-hello-world
% yarn && yarn build
% yarn start

```
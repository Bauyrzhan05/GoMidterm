package config

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var FoodCollection *mongo.Collection
var AuthorsCollection *mongo.Collection

func ConnectMongo() *mongo.Client {
	clientOptions := options.Client().ApplyURI("mongodb+srv://bauyrzhan:erman2023@cluster0.cdvoh.mongodb.net/")
	client, _ := mongo.Connect(context.TODO(), clientOptions)

	fmt.Println("✅ Connected to MongoDB!")

	db := client.Database("Golang")

	FoodCollection = db.Collection("foods")
	AuthorsCollection = db.Collection("users")

	return client
}

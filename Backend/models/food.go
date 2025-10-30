package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Food struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Price       string             `bson:"price" json:"price"`
	Category    string             `bson:"category" json:"category"`
	Image       string             `bson:"image" json:"image"`
}

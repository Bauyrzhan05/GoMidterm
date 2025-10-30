package handlers

import (
	"MyProject1/Midterm1/config"
	"MyProject1/Midterm1/models"
	"context"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	// Check if email already exists
	var existing models.User
	err := config.AuthorsCollection.FindOne(context.TODO(), bson.M{"userEmail": user.UserEmail}).Decode(&existing)
	if err == nil {
		http.Error(w, "Email already registered", http.StatusBadRequest)
		return
	}

	hashed, _ := models.HashPassword(user.Password)
	user.Password = hashed
	user.ID = primitive.NewObjectID()

	_, err = config.AuthorsCollection.InsertOne(context.TODO(), user)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "✅ Registered successfully!"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	json.NewDecoder(r.Body).Decode(&creds)

	var found models.User
	err := config.AuthorsCollection.FindOne(context.TODO(), bson.M{"userEmail": creds.UserEmail}).Decode(&found)
	if err != nil {
		http.Error(w, "❌ User not found", http.StatusUnauthorized)
		return
	}

	if !models.CheckPasswordHash(creds.Password, found.Password) {
		http.Error(w, "❌ Incorrect password", http.StatusUnauthorized)
		return
	}

	token, _ := models.CreateToken(found.ID, found.UserName, found.Role)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Login successful",
		"token":   token,
	})
}

package handlers

import (
	"MyProject1/Midterm1/config"
	"MyProject1/Midterm1/models"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func respondJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func saveImage(r *http.Request) (string, error) {
	file, handler, err := r.FormFile("image")
	if err != nil {
		return "", err
	}
	defer file.Close()

	os.MkdirAll("Midterm1/uploads", os.ModePerm)
	filePath := filepath.Join("Midterm1/uploads", handler.Filename)

	dst, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer dst.Close()
	io.Copy(dst, file)

	return filePath, nil
}

func AddFoodHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	imgPath, _ := saveImage(r)

	food := models.Food{
		Name:        r.FormValue("name"),
		Description: r.FormValue("description"),
		Price:       r.FormValue("price"),
		Category:    r.FormValue("category"),
		Image:       imgPath,
	}

	res, _ := config.FoodCollection.InsertOne(context.TODO(), food)

	respondJSON(w, map[string]interface{}{"success": true, "food_id": res.InsertedID})
}

func ListFoodsHandler(w http.ResponseWriter, _ *http.Request) {
	cursor, _ := config.FoodCollection.Find(context.TODO(), bson.M{})

	var foods []models.Food
	cursor.All(context.TODO(), &foods)

	respondJSON(w, map[string]interface{}{"success": true, "data": foods})
}

func UpdateFoodHandler(w http.ResponseWriter, r *http.Request) {
	id, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])

	r.ParseMultipartForm(10 << 20)
	update := bson.M{
		"name":        r.FormValue("name"),
		"description": r.FormValue("description"),
		"price":       r.FormValue("price"),
		"category":    r.FormValue("category"),
	}

	if imgPath, err := saveImage(r); err == nil {
		update["image"] = imgPath
	}

	config.FoodCollection.UpdateByID(context.TODO(), id, bson.M{"$set": update})

	respondJSON(w, map[string]interface{}{"success": true, "message": "Food updated"})
}

func DeleteFoodHandler(w http.ResponseWriter, r *http.Request) {
	id, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])

	config.FoodCollection.DeleteOne(context.TODO(), bson.M{"_id": id})

	respondJSON(w, map[string]interface{}{"success": true, "message": "Food deleted"})
}

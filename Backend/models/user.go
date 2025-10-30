package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserName  string             `bson:"userName" json:"userName"`
	UserEmail string             `bson:"userEmail" json:"userEmail"`
	Password  string             `bson:"password,omitempty" json:"password"`
	Role      string             `bson:"role" json:"role"` // Admin, user, manager
}

var jwtSecret = []byte("mysecretjwtkey")

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CreateToken(userID primitive.ObjectID, userName string, role string) (string, error) {
	claims := jwt.MapClaims{
		"uid":      userID.Hex(),
		"userName": userName,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
		"iat":      time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

package test

import (
	"encoding/json"
	"io/ioutil"
)

// Test ...
type Test struct {
	DoubleProp float64 `json:"doubleProp"`
	Hello      string  `json:"hello"`
	IntProp    int     `json:"intProp"`
	World      string  `json:"world"`
}

// ParseTest loads a Test from a JSON file.
func ParseTest(file string) (*Test, error) {
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var data Test
	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

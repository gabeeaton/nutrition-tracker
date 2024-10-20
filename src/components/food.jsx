import React, { useState, createContext } from "react";
import "./food.css";
import axios from "axios";
import { Link } from "react-router-dom";

export const app_key = import.meta.env.VITE_API_KEY;
export const app_id = import.meta.env.VITE_APP_ID
export const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;

export const ApiContext = createContext(null);

function Food({ setSelection }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [selectedServing, setSelectedServing] = useState("Serving Size");
  const [isDrop, setISDrop] = useState(false);
  const [servingType, setServingType] = useState("");
  const [dropData, setDropData] = useState("");
  const [addSelect, setAddSelect] = useState("");
  const [index, setIndex] = useState("");

  function calcServingNutrition(servingType) {
    if (servingType === "ounces") {

    }
    else if (servingType === "grams") {

    }
  }


  const handleSelect = (selectedServing) => {
    setSelectedServing(selectedServing);
  }

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(API_URL, {
        params: {
          ingr: search,
        },
      });
      const data = response.data;
      setResults(data.hints);
    } catch (err) {
      console.error(err.message);
    }
  };

  function convertGrams(grams) {
    const oz = (grams / 28).toFixed(1);
    return oz;
  }

  function handleInfoClick(food) {
    setSelection(food);
  }

  function handleIndex(index) {
    setIndex(index);
  }


  return (
    <>
      <div>
        <h3 style={{ color: "white" }}>Log Your Food</h3>
      </div>
      <div className="search-container">
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <form onSubmit={submitForm}>
            <input
              placeholder="Search"
              type="search"
              className="input"
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </form>
          <button className="custom-food">
            Add a custom food
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              fill="currentColor"
              className="bi bi-plus-lg cust"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                stroke="white"
                strokeWidth="1.05"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
            </svg>
          </button>
        </div>
      </div>
      <div></div>
      <div className="parent-container">
        <div className="results">
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <div className="parent-food-block">
                <div className="food-block">
                  <div>
                    <div className="food-item">
                      <div className="food-name">
                        {result.food.label}: {result.food.nutrients.ENERC_KCAL.toFixed(0)} cal per{" "}
                        {result.measures[0].weight.toFixed(0)}g{" "}
                        ({convertGrams(result.food.nutrients.ENERC_KCAL.toFixed(1))} oz)
                      </div>
                      <div className="buttons">
                        <button className="add-button" onClick={() => {
                          setIsModal(true);
                          handleInfoClick(result.food);
                          handleIndex(index);
                        }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            fill="currentColor"
                            className="bi bi-plus-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              stroke="white"
                              strokeWidth="1.05"
                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                            />
                          </svg>
                        </button>
                        <Link to="/food-info" info={result.food}>
                          <button className="info-button" onClick={() => handleInfoClick(result.food)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="21"
                              height="21"
                              fill="currentColor"
                              className="bi bi-info-lg"
                              viewBox="0 0 16 16"
                            >
                              <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0" />
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Food</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={() => setISDrop(!isDrop)}
                    >
                      {selectedServing}
                    </button>
                    {isDrop && (
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a className="dropdown-item" href="#" onClick={() => {
                          handleSelect(`${(results[index].measures[0].weight.toFixed(0))} g`)
                          setServingType("grams")
                          console.log(results[index].food);
                        }}>{(results[index].measures[0].weight.toFixed(0))} g</a></li>

                        <li><a className="dropdown-item" href="#" onClick={() => {
                          handleSelect(`${convertGrams(results[index].food.nutrients.ENERC_KCAL.toFixed(1))} oz`)
                          setServingType("ounces")
                        }}>{convertGrams(results[index].food.nutrients.ENERC_KCAL.toFixed(1))} oz</a></li>

                        <li><a className="dropdown-item" href="#" onClick={() => {
                          handleSelect('1 oz')
                          setServingType("grams")
                          console.log(results[index].food);
                        }}>1 oz</a></li>

                         <li><a className="dropdown-item" href="#" onClick={() => {
                          handleSelect('1 g')
                          setServingType("grams")
                          console.log(results[index].food);
                        }}>1 g</a></li>
                      </ul>

                    )}
                  </div>
                  <input type="number" className="form-control" placeholder="Number of Servings">

                  </input>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModal(false)}>Close</button>
                  <button type="button" className="btn btn-success log-btn">Log Food</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Food
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./MostProduct.css"; // Import your CSS file for styling
import apiConfig from "../../../../config/apiConfig";
import { getAuthData } from "../../../../utils/authHelper";

const API_URL = apiConfig.seller;

const MostPopularProducts = () => {
  const { token } = getAuthData(); // Get authentication token
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch most popular products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products?sort=-rating&limit=6&rating[gte]=4&status=approved`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token for authentication
            },
          }
        );
        setProducts(response.data.doc); // Set products data
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className="snipcss-lNb6N">
      <div className="card h-100 remove-card-shadow">
        <div className="card-header">
          <h4 className="d-flex align-items-center text-capitalize gap-4 font-semibold mb-0">
            <img width="20" src="/most-popular-product.png" alt="" /> Most
            Popular Products
          </h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="grid-card-wrap">
                {products?.map((product) => (
                  <div
                    key={product?._id}
                    className="cursor-pointer grid-card basic-box-shadow get-view-by-onclick"
                  >
                    <div>
                      <img
                        className="avatar avatar-bordered border-gold avatar-60 rounded"
                        src={`${apiConfig.bucket}/${product.thumbnail}`}
                        alt={product?.name}
                      />
                    </div>
                    <div className="title-color text-center line--limit-1">
                      {product.name}
                    </div>
                    <div className="d-flex align-items-center gap-1 fz-10">
                      <span className="rating-color text-[1rem] d-flex align-items-center font-weight-bold gap-1">
                        <FaStar className="text-[1rem]" /> {product?.rating || 0}
                      </span>
                      <span className="d-flex align-items-center gap-10">
                        ({product?.numOfReviews} Reviews)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostPopularProducts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import apiConfig from "../../../../config/apiConfig";
import { getAuthData } from "../../../../utils/authHelper";

const TopSellingProducts = () => {
  const { token, user } = getAuthData();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTopSellingProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${apiConfig.seller}/products?sort=-sold&limit=6&status=approved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTopProducts(response.data.doc);
    } catch (err) {
      setError("Failed to fetch top-selling products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="snipcss-5ovlo">
      <div className="card h-100 remove-card-shadow">
        <div className="card-header gap-10">
          <h4 className="d-flex align-items-center text-capitalize gap-4 font-semibold mb-0">
            <img width="20" src="/top-selling-product-icon.png" alt="" /> Top
            Selling Products
          </h4>
        </div>
        <div className="p-4">
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer get-view-by-onclick"
                >
                  <div className="p-2 rounded-md flex justify-between items-center bg-transparent basic-box-shadow">
                    <div className="d-flex gap-10 align-items-center">
                      <img
                        src={`${apiConfig.bucket}/${product?.thumbnail}`}
                        className="avatar avatar-lg rounded avatar-bordered"
                        alt={`${product.name}_Image`}
                      />
                      <div className="title-color line--limit-2">
                        {product.name.length > 25
                          ? `${product.name.slice(0, 25)}...`
                          : product.name}
                      </div>
                    </div>
                    <div className="orders-count py-2 px-3 d-flex gap-1">
                      <div>Sold :</div>
                      <div className="font-semibold">{product.sold}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;

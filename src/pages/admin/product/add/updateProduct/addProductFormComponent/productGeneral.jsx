import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineSync } from "react-icons/ai";
import {
  fetchAttributes,
  fetchBrands,
  fetchCategories,
  fetchColors,
} from "../../../../../../redux/slices/admin/categorybrandSlice";
import { IoIosInformationCircleOutline, IoMdPerson } from "react-icons/io";
import FormSection from "../../../../../../components/FormInput/FormSection";
import FormSelect from "../../../../../../components/FormInput/FormSelect";

const generateSKU = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const ProductGeneral = ({ formData, handleChange, setFormData }) => {
  const dispatch = useDispatch();
  const { categories, subCategories, subSubCategories, brands } = useSelector(
    (state) => state.category
  );

  const [tags, setTags] = useState(
    (formData.tags || []).filter((tag) => tag.trim() !== "")
  );

  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredSubSubCategories, setFilteredSubSubCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchColors());
    dispatch(fetchAttributes());
  }, [dispatch]);

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (formData.category) {
      console.log("Selected Category:", formData.category); // Debug category
      const relevantSubCategories = subCategories.filter(
        (sub) => sub.mainCategory._id === formData.category
      );
      console.log("Filtered SubCategories:", relevantSubCategories); // Debug subcategories
      setFilteredSubCategories(relevantSubCategories);
      setFilteredSubSubCategories([]); // Reset sub-sub-categories
    }
  }, [formData.category, subCategories]);
  useEffect(() => {
    if (formData.category && formData.subCategory) {
      console.log("Selected Category:", formData.category); // Debug category
      console.log("Selected SubCategory:", formData.subCategory); // Debug subcategory
  
      // Check if subSubCategories are available
      if (subSubCategories && subSubCategories.doc) {
        const relevantSubSubCategories = subSubCategories.doc.filter(
          (subSub) => subSub.subCategory?._id === formData.subCategory
        );
  
        console.log("Filtered Sub-Sub-Categories:", relevantSubSubCategories); // Debug sub-sub-categories
        setFilteredSubSubCategories(relevantSubSubCategories);
      }
    }
  }, [formData.category, formData.subCategory, subSubCategories]); 
  
  const handleGenerateSKU = () => {
    const newSKU = generateSKU();
    setFormData((prevData) => ({
      ...prevData,
      sku: newSKU,
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setFormData((prevData) => ({
          ...prevData,
          tags: updatedTags,
        }));
      }
      e.target.value = "";
    }
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
    setFormData((prevData) => ({
      ...prevData,
      tags: updatedTags,
    }));
  };

  return (
    <>
      <FormSection title="General Information" icon={<IoMdPerson />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col px-2">
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.length > 0
                ? categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))
                : []}
              required
            />
          </div>

                  {/* Sub-Category */}
<div className="flex flex-col px-2">
  <FormSelect
    label="Sub-Category"
    name="subCategory"
    value={formData.subCategory || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        subCategory: e.target.value === "" ? null : e.target.value,
      })
    }
    options={[
      ...(filteredSubCategories.length > 0
        ? filteredSubCategories.map((subCategory) => ({
            value: subCategory._id,
            label: subCategory.name,
          }))
        : []),
    ]}
  />
</div> 

          {/* Sub-Category */}
          {/* <div className="flex flex-col px-2">
            <FormSelect
              label="Sub-Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              options={filteredSubCategories.length > 0
                ? filteredSubCategories.map((subCategory) => ({
                    value: subCategory._id,
                    label: subCategory.name,
                }))
                : []}
            />
          </div> */}

          {/* Sub-Sub-Category */}
          {/* <div className="flex flex-col px-2">
            <FormSelect
              label="Sub-Sub-Category"
              name="subSubCategory"
              value={formData.subSubCategory}
              onChange={handleChange}
              options={filteredSubSubCategories.length > 0
                ? filteredSubSubCategories.map((subSubCategory) => ({
                    value: subSubCategory._id,
                    label: subSubCategory.name,
                }))
                : [{ value: "", label: "Not Sub-Sub-Category Found" }]}
            />
          </div> */}

          {/* Brand */}
          <div className="flex flex-col px-2">
            <FormSelect
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              options={brands.length > 0
                ? brands.map((brand) => ({
                    value: brand._id,
                    label: brand.name,
                  }))
                : [{ value: "", label: "Not Brand Found" }]}
              required
            />
          </div>

          {/* Product Type */}
          <div className="flex flex-col px-2">
            <FormSelect
              label="Product Type"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              options={[
                { value: "physical", label: "Physical" },
                { value: "digital", label: "Digital" },
              ]}
              required
            />
          </div>

          {/* Conditionally Render Digital Product Type */}
          {formData.productType === "digital" && (
            <div className="flex flex-col px-2">
              <FormSelect
                label="Digital Product Type"
                name="digitalProductType"
                value={formData.digitalProductType}
                onChange={handleChange}
                options={[
                  { value: "readyAfterSell", label: "Ready After Sell" },
                  { value: "readyProduct", label: "Ready Product" },
                ]}
              />
            </div>
          )}

          {/* SKU */}
          <div className="flex flex-col px-2">
            <div className="flex justify-between items-center">
              <label className="">Product SKU</label>
              <button
                className="text-primary flex items-center hover:text-primary-dark"
                onClick={handleGenerateSKU}
              >
                <IoIosInformationCircleOutline className="text-[1rem]" />
                Generate Code
              </button>
            </div>

            <div className="form-group flex items-center">
              <input
                type="text"
                className="form-control form-control-user flex-1 outline-none hover:border-primary"
                name="sku"
                placeholder="Code"
                value={formData.sku}
                readOnly
              />
              <AiOutlineSync
                onClick={handleGenerateSKU}
                className="cursor-pointer text-primary hover:text-primary-dark ml-2"
                title="Generate SKU"
                size={24}
              />
            </div>
          </div>

      {/* Unit */}
<div className="flex flex-col px-2">
  <FormSelect
    label="Unit"
    name="unit"
    value={formData.unit}
    onChange={handleChange}
    options={[
      // Units for Quantity
      { value: "piece", label: "Piece(s)" },
      { value: "dozen", label: "Dozen" },
      { value: "gross", label: "Gross (144 pieces)" },
      { value: "pair", label: "Pair" },
      { value: "set", label: "Set" },

      // Units for Weight
      { value: "kg", label: "Kilogram (kg)" },
      { value: "g", label: "Gram (g)" },
      { value: "mg", label: "Milligram (mg)" },
      { value: "ct", label: "Carat (ct)" },
      { value: "oz", label: "Ounce (oz)" },
      { value: "lb", label: "Pound (lb)" },
      { value: "tola", label: "Tola" },

      // Units for Liquid Measurement
      { value: "ml", label: "Milliliter (ml)" },
      { value: "liter", label: "Liter (L)" },
      { value: "fl_oz", label: "Fluid ounce (fl oz)" },

      // Units for Length/Size
      { value: "m", label: "Meter (m)" },
      { value: "cm", label: "Centimeter (cm)" },
      { value: "mm", label: "Millimeter (mm)" },
      { value: "inch", label: "Inch" },
      { value: "ft", label: "Foot (ft)" },
      { value: "yard", label: "Yard" },

      // Units for Area
      { value: "sqm", label: "Square meter (sqm)" },
      { value: "sq_ft", label: "Square foot (sq ft)" },
      { value: "acre", label: "Acre" },

      // Units for Volume
      { value: "cbm", label: "Cubic meter (cbm)" },
      { value: "cc", label: "Cubic centimeter (cc)" },

      // Miscellaneous
      { value: "pack", label: "Pack(s)" },
      { value: "bundle", label: "Bundle" },
      { value: "box", label: "Box" },
      { value: "roll", label: "Roll" },
      { value: "pouch", label: "Pouch" },
      { value: "barrel", label: "Barrel" },
    ]}
    required
  />
</div>

        </div>

        {/* Tags Section */}
        <div className="flex flex-col mt-4">
          <label className="font-semibold"> Search Tags</label>
          <div className="flex flex-wrap border border-gray-300 p-2 rounded">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 m-1 rounded inline-flex items-center"
              >
                {tag}
                <AiOutlineClose
                  onClick={() => removeTag(index)}
                  className="cursor-pointer border border-primary font-semibold  ml-1 rounded-full text-red-500"
                />
              </span>
            ))}
            <input
              type="text"
              className="flex-1 border-none outline-none focus:ring-0 p-1"
              placeholder="Press Enter to add tag"
              // value={formData.tags.join(", ")} // Display tags as comma-separated values
              onKeyPress={handleTagInput}
            />
          </div>
        </div>
      </FormSection>
    </>
  );
};

export default ProductGeneral;

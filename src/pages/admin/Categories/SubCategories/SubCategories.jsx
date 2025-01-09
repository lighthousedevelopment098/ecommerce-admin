import React, {
	useState,
	useEffect,
	useCallback,
	lazy,
	Suspense,
	memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
	fetchSubCategories,
	createSubCategory,
	deleteSubCategory,
	updateSubCategory,
} from "../../../../redux/slices/admin/subCategorySlice";
import { fetchCategories } from "../../../../redux/slices/admin/categorySlice";
import ConfirmationModal from "../../../../components/FormInput/ConfirmationModal";
import LoadingSpinner from "../../../../components/LoodingSpinner/LoadingSpinner";
import {
	getUploadUrl,
	optimizeImageAndUpload,
	uploadImageToS3,
} from "../../../../utils/helpers";

// Lazy load components
const SubCategoryForm = lazy(() => import("./add/SubCategoryForm"));
const SubCategoryList = lazy(() => import("./list/SubCategoryList"));

const SubCategoriess = () => {
	const dispatch = useDispatch();
	const { subCategories, loading, error } = useSelector(
		(state) => state.productSubcategory
	);
	const { categories } = useSelector((state) => state.productCategory);

	const [formData, setFormData] = useState({
		name: "",
		mainCategory: "",
		priority: "",
		logo: "",
	});
	const [selectedFile, setSelectedFile] = useState(null);

	const [editMode, setEditMode] = useState(false);
	const formRef = React.useRef(); // Create a ref for the form section

	const loadData = useCallback(async () => {
		try {
			await Promise.all([
				dispatch(fetchSubCategories()).unwrap(),
				dispatch(fetchCategories()).unwrap(),
			]);
		} catch (error) {
			Swal.fire("Error!", "Failed to load data", "error");
		}
	}, [dispatch]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	// const handleSubmit = useCallback(
	//   async (e) => {
	//     e.preventDefault();

	//     let imageKey = formData.logo; // Default to the current logo value

	//     // Upload a new image only if a new file is selected
	//     if (selectedFile) {
	//       try {
	//         const uploadConfig = await getUploadUrl(selectedFile.type, "subcategory");
	//         imageKey = await uploadImage(uploadConfig, selectedFile);

	//         if (!imageKey) {
	//           Swal.fire("Error", "Image upload failed, please try again.", "error");
	//           return; // Stop further processing if the image upload fails
	//         }
	//       } catch (error) {
	//         console.error("Image upload failed:", error);
	//         Swal.fire("Error", "Image upload failed, please try again.", "error");
	//         return;
	//       }
	//     }

	//     try {
	//       // Check if we are in edit mode
	//       if (editMode && !formData?.id) {
	//         throw new Error("Sub-category ID is missing for update.");
	//       }

	//       // Prepare data for submission
	//       const dataToSubmit = {
	//         subCategoryId: editMode ? formData?.id : undefined, // Pass the ID for the update
	//         subCategoryData: {
	//           name: formData.name,
	//           mainCategory: formData.mainCategory,
	//           priority: formData.priority,
	//           logo: imageKey,
	//         },
	//       }
	//       console.log("data to submit", dataToSubmit)
	//       await dispatch(
	//         editMode
	//           ? updateSubCategory(dataToSubmit)
	//           : createSubCategory(dataToSubmit)
	//       );

	//       Swal.fire(
	//         "Success!",
	//         `Sub-category ${editMode ? "updated" : "created"} successfully.`,
	//         "success"
	//       );

	//       resetForm();
	//       await loadData();
	//     } catch (error) {
	//       Swal.fire("Error!", "Failed to process the request.", "error");
	//     }
	//   },
	//   [editMode, formData, dispatch, loadData]
	// );

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			let imageKey = formData.logo; // Use current logo by default

			// Check if a new file is selected
			if (selectedFile) {
				try {
					const uploadConfig = await getUploadUrl(
						selectedFile.type,
						"subcategory"
					);
					imageKey = await uploadImage(uploadConfig, selectedFile);

					if (!imageKey) {
						Swal.fire(
							"Error",
							"Image upload failed, please try again.",
							"error"
						);
						return;
					}
				} catch (error) {
					console.error("Image upload failed:", error);
					Swal.fire("Error", "Image upload failed, please try again.", "error");
					return;
				}
			}

			try {
				const dataToSubmit = {
					subCategoryId: editMode ? formData.id : undefined, // ID for update
					subCategoryData: {
						name: formData.name,
						mainCategory: formData.mainCategory,
						priority: formData.priority,
						logo: imageKey, // Use updated or existing logo
					},
				};

				await dispatch(
					editMode
						? updateSubCategory(dataToSubmit)
						: createSubCategory(dataToSubmit)
				);

				Swal.fire(
					"Success!",
					`Sub-category ${editMode ? "updated" : "created"} successfully.`,
					"success"
				);

				resetForm();
				await loadData();
			} catch (error) {
				console.error("Error submitting data:", error);
				Swal.fire("Error!", "Failed to process the request.", "error");
			}
		},
		[editMode, formData, selectedFile, dispatch, loadData]
	);

	const resetForm = useCallback(() => {
		setFormData({ name: "", mainCategory: "", priority: "" });
		setEditMode(false);
	}, []);

	const handleDelete = useCallback(
		async (id) => {
			const confirmed = await ConfirmationModal({
				title: "Are you sure?",
				text: "Once deleted, you will not be able to recover this sub-category!",
				icon: "warning",
				dangerMode: true,
			});

			if (confirmed) {
				try {
					await dispatch(deleteSubCategory(id)).unwrap();
					Swal.fire("Deleted!", "Sub-category has been deleted.", "success");
					await loadData();
				} catch (error) {
					Swal.fire("Error!", "Failed to delete the sub-category.", "error");
				}
			}
		},
		[dispatch, loadData]
	);

	const handleEdit = useCallback((subCategory) => {
		setFormData({
			id: subCategory?._id,
			name: subCategory?.name,
			mainCategory: subCategory?.mainCategory,
			priority: subCategory?.priority,
			logo: subCategory?.logo,
		});
		setEditMode(true);
		formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	async function uploadImage(uploadConfig, file) {
		try {
			// await uploadImageToS3(uploadConfig.url, file);
			await optimizeImageAndUpload(uploadConfig.url, file);

			return uploadConfig.key; // Return the key if successful
		} catch (error) {
			console.error(`Failed to upload ${file.name}:`, error);
			return null; // Return null on failure
		}
	}

	const handleFileChange = (logoString) => {
		setNewCategory({ ...formData, logo: logoString });
	};

	if (loading)
		return (
			<div>
				<LoadingSpinner />
			</div>
		);
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="content container-fluid">
			<div className="font-bold pb-4 text-xl flex gap-2 items-start">
				<h2 className="h1 mb-2 text-capitalize d-flex align-items-center gap-2">
					<img
						src="/add-new-seller.png"
						alt="Table Heading Icon"
						className="w-8 h-8"
					/>
					<span className="form-label text-[1.5rem] font-semibold text-primary-500">
						Sub Categories
					</span>
				</h2>
			</div>
			<div className="card">
				<div className="card-body" ref={formRef}>
					<Suspense fallback={<div></div>}>
						<MemoizedSubCategoryForm
							formData={formData}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							categories={categories}
							handleFileChange={handleFileChange}
							setSelectedFile={setSelectedFile}
						/>
					</Suspense>
				</div>
			</div>

			<Suspense>
				<MemoizedSubCategoryList
					subCategories={subCategories}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
				/>
			</Suspense>
		</div>
	);
};

// Memoize the form and list to prevent unnecessary re-renders
const MemoizedSubCategoryForm = memo(SubCategoryForm);
const MemoizedSubCategoryList = memo(SubCategoryList);

export default SubCategoriess;

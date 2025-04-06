import { useEffect, useState } from "react";
import "./rewarditem.css";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

export default function Rewarditem() {
  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    points: null,
    stock: null,
    category: "",
    image: null,
  });

  useEffect(() => {
    fetchReward();
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${URL}/route`);
      setCategories(response?.data?.routes || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchReward = async () => {
    try {
      const response = await axios.get(`${URL}/rewarditem`);
      setRewards(response?.data || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const filteredRewards =
    selectedCategory === "all"
      ? rewards
      : rewards.filter(
          (reward) =>
            reward.category === selectedCategory ||
            reward.category?._id === selectedCategory
        );

  const handleCreateReward = async () => {
    try {
      const formData = new FormData();
      Object.entries(newReward).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await axios.post(`${URL}/rewarditem`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRewards([...rewards, response.data]);
      setShowCreateModal(false);
      resetRewardForm();
    } catch (err) {
      console.error("Error creating reward:", err);
    }
  };

  const handleDeleteReward = async (id) => {
    try {
      await axios.delete(`${URL}/rewarditem/${id}`);
      await fetchReward();
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const openEditModal = (reward) => {
    setCurrentReward(reward);
    setShowEditModal(true);
  };

  const handleEditReward = async () => {
    if (currentReward) {
      try {
        const formData = new FormData();
        Object.entries(newReward).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        await axios.put(`${URL}/rewarditem/${currentReward._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await fetchReward();
        setShowEditModal(false);
        resetRewardForm();
        setCurrentReward(null);
      } catch (error) {
        console.error("Error updating reward:", error);
      }
    }
  };

  const resetRewardForm = () => {
    setNewReward({
      title: "",
      description: "",
      points: null,
      stock: null,
      category: "",
      image: null,
    });
  };

  useEffect(() => {
    if (currentReward) {
      setNewReward({
        title: currentReward.title || "",
        description: currentReward.description || "",
        points: currentReward.points || 0,
        stock: currentReward.stock || 0,
        category: currentReward.category?._id || currentReward.category || "",
        image: null,
      });
    }
  }, [currentReward]);

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <button
          className="filter-category-button"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          {selectedCategory === "all"
            ? "All Categories"
            : categories.find((c) => c._id === selectedCategory)?.name ||
              "Category"}
        </button>

        {showCategoryDropdown && (
          <div className="category-dropdown-modal">
            <div
              className={`category-option ${
                selectedCategory === "all" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedCategory("all");
                setShowCategoryDropdown(false);
              }}
            >
              All Categories
            </div>
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`category-option ${
                  selectedCategory === cat._id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setShowCategoryDropdown(false);
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}

        <button
          className="new-reward-button"
          onClick={() => setShowCreateModal(true)}
        >
          New Reward
        </button>
      </div>

      <div className="rewards-grid">
        {filteredRewards.map((reward) => (
          <div className="reward-card" key={reward._id}>
            <div className="reward-image">
              <img src={`${URL}/images/${reward.image}`} alt={reward.title} />
            </div>
            <div className="reward-info">
              <h3 className="reward-name">{reward.title}</h3>
              <p className="reward-description">{reward.description}</p>
              <div className="reward-price-container">
                <span className="reward-price">{reward.points} points</span>
              </div>
              <div className="reward-actions">
                <button
                  className="edit-button"
                  onClick={() => openEditModal(reward)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReward(reward._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modals">
            <h2>Create New Reward</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newReward.title}
                  onChange={(e) =>
                    setNewReward({ ...newReward, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={newReward.description}
                  onChange={(e) =>
                    setNewReward({ ...newReward, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Points:</label>
                <input
                  type="number"
                  value={newReward.points}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      points: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  value={newReward.stock}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={newReward.category}
                  onChange={(e) =>
                    setNewReward({ ...newReward, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewReward({ ...newReward, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button className="save-button" onClick={handleCreateReward}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && currentReward && (
        <div className="modal-overlay">
          <div className="modals">
            <h2>Edit Reward</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newReward.title}
                  onChange={(e) =>
                    setNewReward({ ...newReward, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={newReward.description}
                  onChange={(e) =>
                    setNewReward({ ...newReward, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Points:</label>
                <input
                  type="number"
                  value={newReward.points}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      points: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  value={newReward.stock}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={newReward.category}
                  onChange={(e) =>
                    setNewReward({ ...newReward, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewReward({ ...newReward, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="save-button" onClick={handleEditReward}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ABTestingScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ABTestingScreen.css';

function ABTestingScreen() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Report');
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log(feedback); // Replace with actual logic to handle feedback
    console.log(selectedOption);
    setFeedback(''); // Clear feedback after submission
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log(option);
  };

  return (
    <div className="ab-testing-screen">
      <div className="navigation">
        <button className="back-btn" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
      </div>
      <div className="tab-navigation">
        <button className={`tab ${activeTab === 'Report' ? 'active' : ''}`} onClick={() => setActiveTab('Report')}>
          Report
        </button>
        <button className={`tab ${activeTab === 'Inventory' ? 'active' : ''}`} onClick={() => setActiveTab('Inventory')}>
          Inventory
        </button>
        <button className={`tab ${activeTab === 'Scanner' ? 'active' : ''}`} onClick={() => setActiveTab('Scanner')}>
          Scanner
        </button>
      </div>
  
      {activeTab === 'Report' && (
        <div className="tab-content active-content">
          <h2>Report A/B Testing</h2>
          <div className="ab-test-container">
            <div className={`ab-test-option ${selectedOption === 'A' ? 'selected' : ''}`}>
              <h3>UI Option A</h3>
              <div className="ui-placeholder">UI A Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
                Select Option A
              </button>
            </div>
            <div className={`ab-test-option ${selectedOption === 'B' ? 'selected' : ''}`}>
              <h3>UI Option B</h3>
              <div className="ui-placeholder">UI B Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('B')}>
                Select Option B
              </button>
            </div>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you think about the new UI?"
              className="feedback-input"
              disabled={isSubmitting}
            ></textarea>
            <button type="submit" className="submit-feedback-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
  
      {/* Placeholder for Inventory and Scanner tabs content */}
      {activeTab === 'Inventory' && (
        <div className="tab-content active-content">
          <h2>Inventory A/B Testing</h2>
          <div className="ab-test-container">
            <div className={`ab-test-option ${selectedOption === 'A' ? 'selected' : ''}`}>
              <h3>UI Option A</h3>
              <div className="ui-placeholder">UI A Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
                Select Option A
              </button>
            </div>
            <div className={`ab-test-option ${selectedOption === 'B' ? 'selected' : ''}`}>
              <h3>UI Option B</h3>
              <div className="ui-placeholder">UI B Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('B')}>
                Select Option B
              </button>
            </div>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you think about the new UI?"
              className="feedback-input"
              disabled={isSubmitting}
            ></textarea>
            <button type="submit" className="submit-feedback-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
  
      {activeTab === 'Scanner' && (
        <div className="tab-content active-content">
          <h2>Scanner A/B Testing</h2>
          <div className="ab-test-container">
            <div className={`ab-test-option ${selectedOption === 'A' ? 'selected' : ''}`}>
              <h3>UI Option A</h3>
              <div className="ui-placeholder">UI A Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
                Select Option A
              </button>
            </div>
            <div className={`ab-test-option ${selectedOption === 'B' ? 'selected' : ''}`}>
              <h3>UI Option B</h3>
              <div className="ui-placeholder">UI B Placeholder</div>
              <button className="select-option-btn" onClick={() => handleOptionSelect('B')}>
                Select Option B
              </button>
            </div>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you think about the new UI?"
              className="feedback-input"
              disabled={isSubmitting}
            ></textarea>
            <button type="submit" className="submit-feedback-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
  
}

export default ABTestingScreen;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, collection, setDoc } from 'firebase/firestore';
import inventoryBImage from '../abTesting/inventoryB.jpg';
import inventoryAImage from '../abTesting/inventoryA.jpg';
import scannerAImage from '../abTesting/scannerA.jpg';
import reportAImage from '../abTesting/reportA.jpg';
import './ABTestingScreen.css';

function ABTestingScreen() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [activeTab, setActiveTab] = useState('Report');
  const [selections, setSelections] = useState({ Report: '', Inventory: '', Scanner: '' });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (option) => {
    setSelections(prevSelections => ({
      ...prevSelections,
      [activeTab]: option,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (user) {
      try {
        const feedbackDocRef = doc(collection(db, 'userFeedback', activeTab, 'feedback'));
        await setDoc(feedbackDocRef, {
          Option: selections[activeTab],
          Feedback: feedback,
          UID: user.uid,
          timestamp: new Date()
        });

        console.log('Feedback submitted successfully');
        setFeedback('');
        setSelections(prevSelections => ({
          ...prevSelections,
          [activeTab]: '',
        }));
      } catch (error) {
        console.error('Error submitting feedback: ', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('User is not logged in');
      setIsSubmitting(false);
    }
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
          <h2>Report Screen Feedback</h2>
          <div className="ab-test-container">
            <div className={`ab-test-option ${selections['Report'] === 'A' ? 'selected' : ''}`}>
              <h3>UI Option A</h3>
              <img src={reportAImage} alt="Report A" />
              <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
                Select Option A
              </button>
            </div>
            <div className={`ab-test-option ${selections['Report'] === 'B' ? 'selected' : ''}`}>
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
  
      {activeTab === 'Inventory' && (
        <div className="tab-content active-content">
        <h2>Inventory Screen Feedback</h2>
        <div className="ab-test-container">
          <div className={`ab-test-option ${selections['Inventory'] === 'A' ? 'selected' : ''}`}>
            <h3>UI Option A</h3>
            <img src={inventoryAImage} alt="Inventory A" />
            <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
              Select Option A
            </button>
          </div>
          <div className={`ab-test-option ${selections['Inventory'] === 'B' ? 'selected' : ''}`}>
            <h3>UI Option B</h3>
            <img src={inventoryBImage} alt="Inventory B" />
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
        <h2>Scanner Screen Feedback</h2>
        <div className="ab-test-container">
          <div className={`ab-test-option ${selections['Scanner'] === 'A' ? 'selected' : ''}`}>
            <h3>UI Option A</h3>
            <img src={scannerAImage} alt="Scanner B" />
            <button className="select-option-btn" onClick={() => handleOptionSelect('A')}>
              Select Option A
            </button>
          </div>
          <div className={`ab-test-option ${selections['Scanner'] === 'B' ? 'selected' : ''}`}>
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

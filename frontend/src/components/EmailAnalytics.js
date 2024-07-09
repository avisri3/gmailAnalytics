import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Modal from 'react-modal';
import Sentiment from 'sentiment';
import './EmailAnalytics.css';

Chart.register(...registerables);

const EmailAnalytics = ({ authToken }) => {
  const [emailVolume, setEmailVolume] = useState({});
  const [topContacts, setTopContacts] = useState({});
  const [sentimentData, setSentimentData] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [loading, setLoading] = useState(true);

  const [isEmailVolumeModalOpen, setIsEmailVolumeModalOpen] = useState(false);
  const [isTopContactsModalOpen, setIsTopContactsModalOpen] = useState(false);
  const [isSentimentModalOpen, setIsSentimentModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        await axios.get('http://localhost:5000/api/emails/fetch', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (error) {
        console.error('Error fetching emails', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/emails/analytics', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const emails = response.data;
        console.log(`Total emails received from backend: ${emails.length}`);

        const volume = {};
        const contacts = {};
        const sentiment = new Sentiment();
        const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

        emails.forEach(email => {
          const date = new Date(email.date).toISOString().split('T')[0];
          volume[date] = (volume[date] || 0) + 1;
          contacts[email.from] = (contacts[email.from] || 0) + 1;

          // Perform sentiment analysis on email subject
          if (email.subject) {
            const result = sentiment.analyze(email.subject);
            if (result.score > 0) {
              sentimentCounts.positive += 1;
            } else if (result.score < 0) {
              sentimentCounts.negative += 1;
            } else {
              sentimentCounts.neutral += 1;
            }
          }
        });

        setEmailVolume(volume);
        setTopContacts(contacts);
        setSentimentData(sentimentCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchEmails();
      await fetchAnalytics();
    };

    fetchData();
  }, [authToken]);

  const extractName = (email) => {
    const match = email.match(/^([^<]*)</);
    return match ? match[1].trim() : email;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="analytics-container">
      <h2>Email Analytics</h2>
      <div className="button-container">
        <button onClick={() => setIsEmailVolumeModalOpen(true)}>Email Volume Over Time</button>
        <button onClick={() => setIsTopContactsModalOpen(true)}>Top Contacts</button>
        <button onClick={() => setIsSentimentModalOpen(true)}>Sentiment Analysis</button>
      </div>

      <Modal
        isOpen={isEmailVolumeModalOpen}
        onRequestClose={() => setIsEmailVolumeModalOpen(false)}
        contentLabel="Email Volume Chart"
      >
        <div className="modal-header">
          <h3 className="modal-title">Email Volume Over Time</h3>
          <button className="modal-close-button" onClick={() => setIsEmailVolumeModalOpen(false)}>Close</button>
        </div>
        <Line
          data={{
            labels: Object.keys(emailVolume),
            datasets: [{
              label: 'Email Volume',
              data: Object.values(emailVolume),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            }]
          }}
          options={{
            scales: {
              x: { type: 'category', title: { display: true, text: 'Date' } },
              y: { beginAtZero: true, title: { display: true, text: 'Volume' } }
            }
          }}
        />
        <button onClick={() => setIsEmailVolumeModalOpen(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={isTopContactsModalOpen}
        onRequestClose={() => setIsTopContactsModalOpen(false)}
        contentLabel="Top Contacts Chart"
      >
        <div className="modal-header">
          <h3 className="modal-title">Top Contacts</h3>
          <button className="modal-close-button" onClick={() => setIsTopContactsModalOpen(false)}>Close</button>
        </div>
        <Bar
          data={{
            labels: Object.keys(topContacts).map(extractName),
            datasets: [{
              label: 'Top Contacts',
              data: Object.values(topContacts),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }]
          }}
          options={{
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Count' } }
            }
          }}
        />
        <button onClick={() => setIsTopContactsModalOpen(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={isSentimentModalOpen}
        onRequestClose={() => setIsSentimentModalOpen(false)}
        contentLabel="Sentiment Analysis Chart"
      >
        <div className="modal-header">
          <h3 className="modal-title">Sentiment Analysis</h3>
          <button className="modal-close-button" onClick={() => setIsSentimentModalOpen(false)}>Close</button>
        </div>
        <Pie
          data={{
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
              label: 'Sentiment Analysis',
              data: Object.values(sentimentData),
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Sentiment Analysis'
              }
            }
          }}
        />
        <button onClick={() => setIsSentimentModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default EmailAnalytics;

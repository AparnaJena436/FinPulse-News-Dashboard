/* Dual Sentiment Banner */
.dual-sentiment-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.sentiment-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.region-flag {
  font-size: 1.4rem;
}

.sentiment-card h2 {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.sentiment-status {
  font-size: 1.1rem;
  font-weight: bold;
}

/* Responsive fix for phones */
@media (max-width: 768px) {
  .dual-sentiment-banner {
    grid-template-columns: 1fr;
  }
}

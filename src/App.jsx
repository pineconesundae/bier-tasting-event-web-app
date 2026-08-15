import { useCallback, useEffect, useState } from 'react';
import Hero from './components/Hero/Hero.jsx';
import EventDetails from './components/EventDetails/EventDetails.jsx';
import Rules from './components/Rules/Rules.jsx';
import ClaimedBeers from './components/ClaimedBeers/ClaimedBeers.jsx';
import SignupForm from './components/SignupForm/SignupForm.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  const [signups, setSignups] = useState([]);
  const [listState, setListState] = useState({ loading: true, error: '' });

  const loadSignups = useCallback(async () => {
    setListState({ loading: true, error: '' });
    try {
      const response = await fetch('/api/signups');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSignups(data.signups);
      setListState({ loading: false, error: '' });
    } catch {
      setListState({ loading: false, error: 'We couldn\'t load the beer list. Please try again.' });
    }
  }, []);

  useEffect(() => {
    // Loading remote state is the intended synchronization for this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSignups();
  }, [loadSignups]);

  return (
    <>
      <Hero />
      <main>
        <EventDetails />
        <Rules />
        <ClaimedBeers
          signups={signups}
          loading={listState.loading}
          error={listState.error}
          onRetry={loadSignups}
        />
        <SignupForm onSignupSuccess={loadSignups} />
      </main>
      <Footer />
    </>
  );
}

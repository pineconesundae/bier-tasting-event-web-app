import { useCallback, useEffect, useState } from 'react';
import Hero from './components/Hero/Hero.jsx';
import EventDetails from './components/EventDetails/EventDetails.jsx';
import Rules from './components/Rules/Rules.jsx';
import ClaimedBeers from './components/ClaimedBeers/ClaimedBeers.jsx';
import SignupForm from './components/SignupForm/SignupForm.jsx';
import Footer from './components/Footer/Footer.jsx';

function checkAdminMode() {
  return typeof document !== 'undefined' && /(?:^|;\s*)admin_mode=true(?:;|$)/.test(document.cookie);
}

export default function App() {
  const [signups, setSignups] = useState([]);
  const [listState, setListState] = useState({ loading: true, error: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingSignup, setEditingSignup] = useState(null);

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
    setIsAdmin(checkAdminMode());
  }, [loadSignups]);

  function handleEdit(beer) {
    setEditingSignup(beer);
  }

  function handleCancelEdit() {
    setEditingSignup(null);
  }

  async function handleDelete(beer) {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${beer.beer_name}" by ${beer.attendee_name} from the tasting table?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/signups/${beer.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete signup.');

      if (editingSignup?.id === beer.id) {
        setEditingSignup(null);
      }
      await loadSignups();
    } catch (error) {
      alert(error.message);
    }
  }

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
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <SignupForm
          key={editingSignup ? `edit-${editingSignup.id}` : 'new'}
          onSignupSuccess={loadSignups}
          editingSignup={editingSignup}
          onCancelEdit={handleCancelEdit}
        />
      </main>
      <Footer />
    </>
  );
}

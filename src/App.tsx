import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Gamepad, User, Mail, Lock, Star } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  const avatars = [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    'https://images.unsplash.com/photo-1614728263952-84ea256f9679',
    'https://images.unsplash.com/photo-1600081728723-c8aa2ee3236a'
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              avatar_url: avatars[selectedAvatar - 1],
              level: 1,
              aura_points: 0,
              rank: 'Novice Dreamer'
            }
          }
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! Please log in.' });
        setIsLogin(true);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl border-2 border-blue-400 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-['Press_Start_2P'] text-blue-400 mb-2 flex items-center justify-center gap-3">
            <Gamepad className="w-8 h-8" />
            DREAMSCAPE
          </h1>
          <p className="text-gray-400 text-sm">Where Dreams Come to Life</p>
        </div>

        <div className="flex mb-6 border-b-2 border-blue-400">
          <button
            className={`flex-1 py-2 text-sm font-['Press_Start_2P'] ${
              isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
            }`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button
            className={`flex-1 py-2 text-sm font-['Press_Start_2P'] ${
              !isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
            }`}
            onClick={() => setIsLogin(false)}
          >
            REGISTER
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-['Press_Start_2P'] text-blue-400 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-['Press_Start_2P'] text-blue-400 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-['Press_Start_2P'] text-blue-400 mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-['Press_Start_2P'] text-blue-400 mb-4">
                <Star className="inline w-4 h-4 mr-2" />
                SELECT AVATAR
              </label>
              <div className="grid grid-cols-3 gap-4">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-lg p-2 ${
                      selectedAvatar === index + 1 ? 'bg-blue-400 bg-opacity-20' : ''
                    }`}
                    onClick={() => setSelectedAvatar(index + 1)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className={`w-full h-20 object-cover rounded-lg border-2 ${
                        selectedAvatar === index + 1 ? 'border-blue-400' : 'border-gray-600'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {message.text && (
            <div
              className={`p-4 rounded ${
                message.type === 'success' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 font-['Press_Start_2P'] text-sm bg-blue-400 text-black rounded hover:bg-blue-500 transition-colors duration-200"
          >
            {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
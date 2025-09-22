// components/AuthForm.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './AuthForm.module.css'

export default function AuthForm({ onSuccess }) {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [studentId, setStudentId] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [telegramId, setTelegramId] = useState(null)
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false)

  useEffect(() => {
    const initTelegram = () => {
      // Сначала проверяем параметры URL (для отладки)
      const urlParams = new URLSearchParams(window.location.search);
      const urlTgId = urlParams.get('tg_user_id');
      
      if (urlTgId) {
        setTelegramId(urlTgId);
        setIsTelegramWebApp(true);
        console.log('Telegram ID from URL:', urlTgId);
        return;
      }

      // Затем проверяем Telegram Web App
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        setIsTelegramWebApp(true);
        
        // Способ 1: Через initDataUnsafe (самый надежный)
        if (window.Telegram.WebApp.initDataUnsafe?.user) {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          setTelegramId(user.id.toString());
          console.log('Telegram user from initDataUnsafe:', user);
          
          if (user.username && !login) {
            setLogin(`${user.username}@telegram.user`);
          }
        } 
        // Способ 2: Парсим initData вручную
        else if (window.Telegram.WebApp.initData) {
          try {
            const params = new URLSearchParams(window.Telegram.WebApp.initData);
            const userParam = params.get('user');
            if (userParam) {
              const userData = JSON.parse(decodeURIComponent(userParam));
              setTelegramId(userData.id.toString());
              console.log('Telegram user from initData:', userData);
            }
          } catch (e) {
            console.error('Error parsing initData:', e);
          }
        }
        
        // Инициализируем Web App
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Показываем кнопку назад
        if (window.Telegram.WebApp.BackButton) {
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.BackButton.onClick(() => {
            window.Telegram.WebApp.close();
          });
        }
      } else {
        console.warn('Not in Telegram Web App');
        setError('❌ Для регистрации откройте приложение через кнопку в Telegram боте.');
      }
    };

    initTelegram();
  }, [login]);

  const switchMode = (newMode) => {
    setError('')
    setLoading(false)
    setEmailSent(false)
    setMode(newMode)
  }

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: login,
      password
    })
    
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/Personal')
      }
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setError('')

    console.log('Current Telegram ID:', telegramId);
    
    if (!telegramId) {
      return setError('❌ Доступ только через Telegram бота. Убедитесь, что открыли приложение через кнопку "🎓 Зарегистрироваться" в боте.')
    }

    const idNum = parseInt(studentId.trim(), 10)
    if (isNaN(idNum)) {
      return setError('❌ Неверный Student ID. Введите числовой идентификатор.')
    }

    if (password.length < 8 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      return setError('❌ Пароль должен содержать не менее 8 символов, включая буквы и цифры')
    }

    if (password !== confirm) {
      return setError('❌ Пароли не совпадают')
    }

    setLoading(true)
    
    try {
      console.log('Checking pending registration for Telegram ID:', telegramId);
      
      // 1. Получаем контактные данные из pending_registrations
      const { data: pendingData, error: pendingError } = await supabase
        .from('pending_registrations')
        .select('*')
        .eq('telegram_id', telegramId)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (pendingError) {
        console.error('Pending registration error:', pendingError);
        if (pendingError.code === 'PGRST116') {
          throw new Error('❌ Контактные данные не найдены. Вернитесь в бота, отправьте контакт и откройте регистрацию заново.')
        }
      }

      if (!pendingData) {
        throw new Error('❌ Контактные данные не найдены или истекли. Вернитесь в бота и отправьте контакт повторно.')
      }

      console.log('Pending data found:', pendingData);

      // 2. Проверяем student_id
      const { data: stud, error: studError } = await supabase
        .from('students')
        .select('auth_user_id, telegram_id, firstname, lastname')
        .eq('student_id', idNum)
        .single()

      if (studError) {
        console.error('Student check error:', studError);
        if (studError.code === 'PGRST116') {
          throw new Error('❌ Студент с таким ID не найден в базе данных.')
        }
        throw new Error('❌ Ошибка при проверке Student ID.')
      }

      if (!stud) {
        throw new Error('❌ Студент с таким ID не найден в базе данных.')
      }

      if (stud.auth_user_id) {
        throw new Error('❌ Этот Student ID уже зарегистрирован в системе.')
      }

      if (stud.telegram_id && stud.telegram_id !== telegramId) {
        throw new Error('❌ Этот Student ID уже привязан к другому Telegram аккаунту.')
      }

      // 3. Проверяем, не привязан ли уже этот Telegram к другому студенту
      const { data: existingTelegram, error: tgError } = await supabase
        .from('students')
        .select('student_id, firstname, lastname')
        .eq('telegram_id', telegramId)
        .single()

      if (existingTelegram && existingTelegram.student_id !== idNum) {
        throw new Error(`❌ Ваш Telegram уже привязан к студенту: ${existingTelegram.firstname} ${existingTelegram.lastname}`)
      }

      // 4. Создаем пользователя
      const email = pendingData.phone_number ? 
        `${pendingData.phone_number.replace('+', '')}@campus.ru` : 
        `tg${telegramId}@telegram.user`;
      
      console.log('Creating user with email:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      // 5. Обновляем запись студента
      const { error: updateError } = await supabase
        .from('students')
        .update({ 
          auth_user_id: authData.user.id,
          email: email,
          telegram_id: telegramId,
          phone_number: pendingData.phone_number,
          telegram_username: pendingData.username,
          registration_date: new Date().toISOString(),
          is_active: true
        })
        .eq('student_id', idNum)

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // 6. Удаляем временные данные
      await supabase
        .from('pending_registrations')
        .delete()
        .eq('telegram_id', telegramId)

      // 7. Автовход
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (loginError) {
        console.error('Login error:', loginError);
        throw loginError;
      }

      console.log('Registration successful!');
      
      // 8. Успешная регистрация
      if (isTelegramWebApp && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('✅ Регистрация успешно завершена!', () => {
          window.Telegram.WebApp.close();
        });
      } else if (onSuccess) {
        onSuccess();
      } else {
        router.push('/Personal');
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!login.trim()) {
      setError('Введите email')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(login, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setEmailSent(true)
    }
  }

  if (mode === 'forgot') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Восстановление пароля</h2>

        {emailSent ? (
          <div className={styles.successMessage}>
            <p>Письмо с инструкциями отправлено на {login}</p>
            <p>Проверьте вашу почту и следуйте инструкциям</p>
            <button
              onClick={() => switchMode('login')}
              className={styles.switchButton}
            >
              Вернуться к входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className={styles.form}>
            <label className={styles.label}>
              Ваш email:
              <input
                type="email"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
                className={styles.input}
                placeholder="Введите email для восстановления"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Отправка...' : 'Восстановить пароль'}
            </button>

            <p className={styles.switchText}>
              Вспомнили пароль?
              <button
                onClick={() => switchMode('login')}
                className={styles.switchButton}
              >
                Войти
              </button>
            </p>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Отладочная информация */}
      {telegramId && (
        <div style={{ 
          background: '#e3f2fd', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          fontSize: '14px',
          border: '1px solid #90caf9'
        }}>
          <strong>Отладочная информация:</strong><br />
          Telegram ID: {telegramId}<br />
          Режим: {isTelegramWebApp ? 'Telegram Web App' : 'Обычный браузер'}
        </div>
      )}

      <h2 className={styles.title}>
        {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
      </h2>

      <form
        onSubmit={mode === 'login' ? handleLogin : handleRegister}
        className={styles.form}
      >
        {mode === 'register' && (
          <>
            <label className={styles.label}>
              Student ID:
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                required
                className={styles.input}
                placeholder="Введите ваш Student ID"
              />
            </label>
          </>
        )}

        <label className={styles.label}>
          Ваш email:
          <input
            type="email"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            className={styles.input}
            placeholder="example@email.com"
          />
        </label>

        <label className={styles.label}>
          Пароль:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="Не менее 8 символов"
          />
        </label>

        {mode === 'register' && (
          <label className={styles.label}>
            Подтвердите пароль:
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className={styles.input}
              placeholder="Повторите пароль"
            />
          </label>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className={styles.switchText}>
        {mode === 'login' ? (
          <>
            Нет аккаунта?
            <button
              onClick={() => switchMode('register')}
              className={styles.switchButton}
            >
              Регистрация
            </button>
          </>
        ) : (
          <>
            Есть аккаунт?
            <button
              onClick={() => switchMode('login')}
              className={styles.switchButton}
            >
              Вход
            </button>
          </>
        )}
      </p>

      {mode === 'login' && (
        <p className={styles.switchText}>
          Забыли пароль?
          <button
            onClick={() => switchMode('forgot')}
            className={styles.switchButton}
          >
            Восстановить
          </button>
        </p>
      )}
    </div>
  )
}
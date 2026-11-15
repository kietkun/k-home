import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './App.css'

type Room = {
  id: string
  name: string
  type: string
  description: string
  image: string
  price: number
  guests: number
  beds: string
  size: string
  status: 'available' | 'booked'
  features: string[]
}

const rooms: Room[] = [
  {
    id: 'garden-suite',
    name: 'The Garden Suite',
    type: 'Private suite',
    description: 'Slow mornings, leafy views, and a little more room to unwind.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    price: 96,
    guests: 2,
    beds: '1 king bed',
    size: '32 m²',
    status: 'available',
    features: ['Garden view', 'Rain shower', 'Private terrace'],
  },
  {
    id: 'sunroom',
    name: 'The Sunroom',
    type: 'Bright king room',
    description: 'A sunlit hideaway with warm textures and space to do nothing.',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
    price: 78,
    guests: 2,
    beds: '1 queen bed',
    size: '26 m²',
    status: 'available',
    features: ['Pool access', 'Breakfast for two', 'Air conditioning'],
  },
  {
    id: 'bamboo-loft',
    name: 'The Bamboo Loft',
    type: 'Family loft',
    description: 'Room for the whole crew, tucked above the garden canopy.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    price: 128,
    guests: 4,
    beds: '1 king + 2 singles',
    size: '48 m²',
    status: 'booked',
    features: ['Two-level space', 'Garden view', 'Breakfast for four'],
  },
]

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const dayAfter = new Date(today)
dayAfter.setDate(today.getDate() + 2)

function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function Icon({
  name,
  size = 18,
}: {
  name: 'arrow' | 'arrowUpRight' | 'bed' | 'calendar' | 'check' | 'chevron' | 'close' | 'heart' | 'menu' | 'minus' | 'pin' | 'plus' | 'sparkle' | 'sun' | 'users'
  size?: number
}) {
  const paths: Record<typeof name, ReactNode> = {
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    arrowUpRight: <path d="M7 17 17 7M7 7h10v10" />,
    bed: <><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20" /><path d="M6 12h2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    minus: <path d="M5 12h14" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    plus: <path d="M12 5v14m-7-7h14" />,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [checkIn, setCheckIn] = useState(dateValue(tomorrow))
  const [checkOut, setCheckOut] = useState(dateValue(dayAfter))
  const [guests, setGuests] = useState(2)
  const [searchError, setSearchError] = useState('')
  const [availabilityMessage, setAvailabilityMessage] = useState('')
  const [bookingPreview, setBookingPreview] = useState(false)
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [alertPreview, setAlertPreview] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${checkOut}T12:00:00`).getTime() -
        new Date(`${checkIn}T12:00:00`).getTime()) /
        86_400_000,
    ),
  )

  function openBooking(room: Room) {
    if (room.status !== 'available' || guests > room.guests) return
    setBookingPreview(false)
    setSelectedRoom(room)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function checkAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (new Date(`${checkOut}T12:00:00`) <= new Date(`${checkIn}T12:00:00`)) {
      setSearchError('Check-out must be after check-in.')
      return
    }
    setSearchError('')
    const matchingRooms = rooms.filter((room) => room.status === 'available' && room.guests >= guests)
    setAvailabilityMessage(
      matchingRooms.length > 0
        ? `${matchingRooms.length} sample ${matchingRooms.length === 1 ? 'room fits' : 'rooms fit'} ${guests} ${guests === 1 ? 'guest' : 'guests'}. Live date availability is not connected yet.`
        : `No sample room fits ${guests} guests. Please contact the host about larger groups.`,
    )
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })
  }

  function previewBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBookingPreview(true)
  }

  function previewAlert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAlertPreview(true)
  }

  const mapCoordinates = '16.47200735182421,107.5976860428298'

  return (
    <div className="site-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        A little place to land <span className="announcement-divider">·</span> Now welcoming our first guests
        <a href="#rooms" className="announcement-link">Take a look <Icon name="arrow" size={14} /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#" onClick={() => setSelectedRoom(null)} aria-label="K-home, home">
          <span className="brand-mark"><Icon name="sparkle" size={22} /></span>
          <span>K-home<span className="brand-period">.</span><small>STAY A LITTLE LONGER</small></span>
        </a>
        <button className="mobile-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#rooms" onClick={() => { setSelectedRoom(null); setMenuOpen(false) }}>The rooms</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our little story</a>
          <a href="#find-us" onClick={() => setMenuOpen(false)}>Find us</a>
          <button className="nav-cta" type="button" onClick={() => { document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}>
            Find your room <Icon name="arrowUpRight" size={16} />
          </button>
        </nav>
      </header>

      {selectedRoom ? (
        <main className="booking-page">
          <button className="back-link" type="button" onClick={() => { setSelectedRoom(null); setBookingPreview(false) }}>
            <span className="back-arrow">←</span> Back to all rooms
          </button>
          <div className="booking-layout">
            <section className="booking-main">
              <div className="booking-photo-wrap">
                <img className="booking-photo" src={selectedRoom.image} alt={selectedRoom.name} />
                <span className="image-label"><Icon name="pin" size={14} /> A little place to land</span>
              </div>
              <div className="booking-heading">
                <div>
                  <p className="eyebrow">{selectedRoom.type} <span>·</span> {selectedRoom.size}</p>
                  <h1>{selectedRoom.name}</h1>
                </div>
                <span className="availability-pill"><span /> Available to book</span>
              </div>
              <p className="booking-description">{selectedRoom.description} Thoughtful details, slow living, and everything you need to feel at home.</p>
              <div className="room-facts">
                <span><Icon name="users" /> Up to {selectedRoom.guests} guests</span>
                <span><Icon name="bed" /> {selectedRoom.beds}</span>
                <span><Icon name="sun" /> Breakfast included</span>
              </div>
              <div className="booking-divider" />
              <h2 className="subheading">A few things you’ll love</h2>
              <div className="feature-list">
                {selectedRoom.features.map((feature) => <span key={feature}><Icon name="check" size={16} /> {feature}</span>)}
              </div>
              <div className="host-note">
                <div className="host-avatar">K</div>
                <div><strong>A note from your host</strong><p>We’ll help with the little things, from a favorite coffee spot to the best way to get here.</p></div>
                <Icon name="heart" size={20} />
              </div>
            </section>

            <aside className="booking-card">
              <div className="booking-price"><strong>${selectedRoom.price}</strong><span> / night</span><span className="price-rating">★ <b>New stay</b></span></div>
              <form className="booking-form" onSubmit={previewBooking}>
                <div className="booking-dates">
                  <label>CHECK-IN<input aria-label="Check-in date" type="date" min={dateValue(today)} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required /></label>
                  <label>CHECK-OUT<input aria-label="Check-out date" type="date" min={checkIn} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} required /></label>
                </div>
                <label className="form-field">GUESTS
                  <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
                    {Array.from({ length: selectedRoom.guests }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </label>
                <div className="booking-divider" />
                <label className="form-field">YOUR NAME<input type="text" name="name" placeholder="How should we call you?" required /></label>
                <label className="form-field">EMAIL ADDRESS<input type="email" name="email" placeholder="you@example.com" required /></label>
                {searchError && <p className="form-error" role="alert">{searchError}</p>}
                <button className="button button-primary booking-submit" type="submit">Request this stay <Icon name="arrow" size={17} /></button>
                <p className="no-charge">No payment details needed to send an enquiry.</p>
              </form>
              {bookingPreview && (
                <div className="preview-notice" role="status">
                  <strong>Looking good!</strong>
                  <p>This is a demo request preview. No booking was sent or reserved. Connect a booking service to accept real stays.</p>
                </div>
              )}
              <div className="price-breakdown">
                <span>${selectedRoom.price} × {nights} {nights === 1 ? 'night' : 'nights'}</span><strong>${selectedRoom.price * nights}</strong>
                <span>Taxes & fees</span><strong>Included</strong>
                <div /><div />
                <b>Total</b><b>${selectedRoom.price * nights}</b>
              </div>
              <div className="payment-note"><Icon name="heart" size={16} /> Secure payments can be added later with a trusted provider.</div>
            </aside>
          </div>
        </main>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> A SLOWER KIND OF STAY <span className="eyebrow-line" /></p>
              <h1>Find your<br />way back to <em>slow.</em></h1>
              <p className="hero-description">A tiny, thoughtful hideaway for long breakfasts, bare feet, and days that don’t need a plan.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#rooms">Find your room <Icon name="arrow" size={17} /></a>
                <a className="text-link" href="#story">A little about us <Icon name="arrowUpRight" size={15} /></a>
              </div>
              <div className="hero-social-proof">
                <div className="avatar-stack"><span>K</span><span>♡</span><span>✳</span></div>
                <div><strong>Made for feeling at home</strong><small>Small stay. Big exhale.</small></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90" alt="Warm, sunlit living space opening onto a tropical garden" />
                <div className="image-caption"><span className="caption-dot" /><span>YOUR LITTLE CORNER OF SOMEWHERE</span><span className="caption-line" /></div>
              </div>
              <div className="hero-sticker"><span>come as<br />you are</span><Icon name="sparkle" size={20} /></div>
              <div className="photo-index">01 <span>/</span> 03</div>
            </div>
            <div className="hero-location"><Icon name="pin" size={15} /> Our little corner <span>·</span> tucked between green and blue</div>
          </section>

          <form className="availability-search" onSubmit={checkAvailability}>
            <div className="search-field">
              <label htmlFor="check-in"><Icon name="calendar" size={18} /> CHECK IN</label>
              <input id="check-in" type="date" min={dateValue(today)} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required />
            </div>
            <span className="search-separator" />
            <div className="search-field">
              <label htmlFor="check-out"><Icon name="calendar" size={18} /> CHECK OUT</label>
              <input id="check-out" type="date" min={checkIn} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} required />
            </div>
            <span className="search-separator" />
            <div className="search-field guest-field">
              <label><Icon name="users" size={18} /> GUESTS</label>
              <div className="guest-picker">
                <button type="button" aria-label="Remove one guest" onClick={() => setGuests(Math.max(1, guests - 1))}><Icon name="minus" size={14} /></button>
                <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                <button type="button" aria-label="Add one guest" onClick={() => setGuests(Math.min(4, guests + 1))}><Icon name="plus" size={14} /></button>
              </div>
            </div>
            <button type="submit" className="button search-button">Check availability <Icon name="arrow" size={17} /></button>
            {searchError && <p className="search-error" role="alert">{searchError}</p>}
          </form>

          <section className="rooms-section section-wrap" id="rooms">
            <div className="section-heading">
              <div><p className="eyebrow"><span className="eyebrow-line" /> YOUR ROOM, YOUR RHYTHM</p><h2>A place for <em>your pace.</em></h2></div>
            <div className="rooms-heading-note">{availabilityMessage ? <span role="status">{availabilityMessage}</span> : <><span className="live-dot" /> 2 little rooms ready for you <span>·</span> 1 already dreaming</>}</div>
            </div>
            <div className="room-grid">
              {rooms.map((room) => (
                <article className={`room-card ${room.status === 'booked' ? 'room-card-booked' : ''}`} key={room.id}>
                  <div className="room-image-wrap">
                    <img src={room.image} alt={room.name} loading="lazy" />
                    <span className={`room-status ${room.status === 'available' ? 'status-available' : 'status-booked'}`}>
                      <span /> {room.status === 'available' ? 'Available' : 'Booked'}
                    </span>
                    <button className="favorite-button" type="button" aria-label={`Save ${room.name}`} onClick={(event) => event.currentTarget.classList.toggle('is-saved')}><Icon name="heart" size={17} /></button>
                    <span className="room-size">{room.size}</span>
                  </div>
                  <div className="room-card-content">
                    <div className="room-kicker">{room.type}</div>
                    <div className="room-title-row"><h3>{room.name}</h3><span><b>${room.price}</b> / night</span></div>
                    <p className="room-description">{room.description}</p>
                    <div className="room-features"><span><Icon name="users" size={15} /> Up to {room.guests}</span><span><Icon name="bed" size={15} /> {room.beds}</span></div>
                    {room.status === 'available' && guests <= room.guests ? (
                      <button className="room-book-link" type="button" onClick={() => openBooking(room)}>View room & book <Icon name="arrow" size={17} /></button>
                    ) : room.status === 'available' ? (
                      <button className="room-book-link room-disabled-link" type="button" disabled title={`This room accommodates up to ${room.guests} guests`}>Fits up to {room.guests} guests <Icon name="arrow" size={17} /></button>
                    ) : (
                      <button className="room-book-link room-waitlist-link" type="button" onClick={() => { setAlertPreview(false); setShowAlertForm(true) }}>Get a cancellation alert <Icon name="arrow" size={17} /></button>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="rooms-footnote"><Icon name="sparkle" size={16} /> Room availability shown is a sample. Dates are confirmed by your host.</div>
          </section>

          <section className="story-section" id="story">
            <div className="story-image-wrap">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="A thoughtfully styled homestay lounge with natural textures" loading="lazy" />
              <div className="story-stamp"><Icon name="sun" size={20} /><span>GOOD THINGS<br />TAKE THEIR TIME</span></div>
            </div>
            <div className="story-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> A SMALL PLACE WITH A BIG HEART</p>
              <h2>Less itinerary.<br /><em>More here.</em></h2>
              <p>K-home is for the in-between moments. One more cup of coffee, the long way home, and feeling like you belong somewhere new.</p>
              <p>We’re a small, independent homestay, built around warm welcomes and the belief that the best trips leave a little room for nothing at all.</p>
              <a className="story-link" href="#find-us">Come find us <Icon name="arrow" size={17} /></a>
            </div>
          </section>

          <section className="little-things section-wrap">
            <div className="little-heading"><p className="eyebrow"><span className="eyebrow-line" /> THE LITTLE THINGS</p><h2>Thoughtful, not <em>fussy.</em></h2></div>
            <div className="perks-grid">
              <div className="perk"><span className="perk-icon"><Icon name="sun" size={22} /></span><strong>Slow mornings</strong><p>Breakfast is on us. Second coffee is on you.</p></div>
              <div className="perk"><span className="perk-icon"><Icon name="heart" size={22} /></span><strong>Good local tips</strong><p>We know the quiet spots, and we love to share.</p></div>
              <div className="perk"><span className="perk-icon"><Icon name="sparkle" size={22} /></span><strong>Room to breathe</strong><p>Just a few rooms, so it always feels personal.</p></div>
              <div className="perk"><span className="perk-icon"><Icon name="pin" size={22} /></span><strong>Close to it all</strong><p>A peaceful pocket with the neighborhood nearby.</p></div>
            </div>
          </section>

          <section className="reviews-section">
            <div className="review-flower">✳</div>
            <p className="eyebrow"><span className="eyebrow-line" /> FIRST STAYS, FRESH STORIES</p>
            <h2>Be one of our <em>first.</em></h2>
            <p>We’re just getting started. Come stay, make yourself at home, and tell us what you think.</p>
            <a className="button button-dark" href="https://www.google.com/search?q=K-home+Homestay+reviews" target="_blank" rel="noreferrer">Find us on Google <Icon name="arrowUpRight" size={16} /></a>
            <small>Google reviews link is a demo—connect your Google Business Profile before launch.</small>
          </section>

          <section className="location-section section-wrap" id="find-us">
            <div className="location-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> A GOOD PLACE TO GET LOST</p>
              <h2>Find your way<br /><em>to us.</em></h2>
              <p>Find us at the spot marked on the map. We look forward to welcoming you.</p>
              <a className="button button-dark" href={`https://www.google.com/maps/dir/?api=1&destination=${mapCoordinates}`} target="_blank" rel="noreferrer">Get directions <Icon name="arrowUpRight" size={16} /></a>
               <span className="location-address"><Icon name="pin" size={15} /> Huế, Vietnam {/*<span>· 16.4720° N, 107.5977° E</span>*/}</span> 
            </div>
            <div className="map-card">
              <svg className="map-illustration" viewBox="0 0 720 440" role="img" aria-label="Illustrated Huế map with the Perfume River, Trường Tiền Bridge, and K-home by the Như Ý River">
                <rect width="720" height="440" fill="#edf0e7" />
                <path d="M0 0h238v112l-56 28-41-22-49 27L0 121zm0 289 83-16 46 32-21 135H0zm484 0 58-38 178 62v127H516z" fill="#e2e9dc" />
                <path d="M-20 66c82 1 124 22 174 59s87 67 160 83m-294 41c78-30 145-24 218 6s117 41 184 29m-397 94c98-58 163-53 237-20s125 39 186 20m34-306c-29 65-27 119-5 169s35 99 23 209m-390-59c71-37 117-43 169-27m-82 78c52-25 106-26 150-10m113-24c39-19 76-22 115-10" fill="none" stroke="#d8d6c9" strokeWidth="19" strokeLinecap="round" />
                <path d="M-20 66c82 1 124 22 174 59s87 67 160 83m-294 41c78-30 145-24 218 6s117 41 184 29m-397 94c98-58 163-53 237-20s125 39 186 20m34-306c-29 65-27 119-5 169s35 99 23 209m-390-59c71-37 117-43 169-27m-82 78c52-25 106-26 150-10m113-24c39-19 76-22 115-10" fill="none" stroke="#fffdf7" strokeWidth="12" strokeLinecap="round" />
                <g fill="#e6d9c8" opacity=".8">
                  <rect x="42" y="206" width="42" height="20" rx="3" transform="rotate(-13 42 206)" />
                  <rect x="106" y="224" width="34" height="19" rx="3" transform="rotate(17 106 224)" />
                  <rect x="156" y="258" width="44" height="21" rx="3" transform="rotate(-9 156 258)" />
                  <rect x="224" y="222" width="39" height="20" rx="3" transform="rotate(13 224 222)" />
                  <rect x="277" y="256" width="42" height="21" rx="3" transform="rotate(-14 277 256)" />
                  <rect x="172" y="329" width="40" height="21" rx="3" transform="rotate(10 172 329)" />
                  <rect x="229" y="359" width="48" height="22" rx="3" transform="rotate(-8 229 359)" />
                  <rect x="326" y="298" width="40" height="20" rx="3" transform="rotate(15 326 298)" />
                  <rect x="379" y="359" width="42" height="22" rx="3" transform="rotate(-11 379 359)" />
                  <rect x="490" y="211" width="36" height="19" rx="3" transform="rotate(16 490 211)" />
                </g>
                <g fill="#a2b597" opacity=".82">
                  <circle cx="44" cy="303" r="18" /><circle cx="72" cy="315" r="13" /><circle cx="97" cy="299" r="15" />
                  <circle cx="189" cy="286" r="13" /><circle cx="212" cy="299" r="17" /><circle cx="235" cy="285" r="12" />
                  <circle cx="246" cy="320" r="17" /><circle cx="274" cy="331" r="12" /><circle cx="300" cy="314" r="15" />
                  <circle cx="323" cy="374" r="18" /><circle cx="351" cy="387" r="13" /><circle cx="377" cy="372" r="16" />
                  <circle cx="560" cy="71" r="17" /><circle cx="589" cy="86" r="12" /><circle cx="616" cy="67" r="15" />
                </g>
                <g fill="#6f8768" opacity=".55">
                  <circle cx="44" cy="300" r="4" /><circle cx="72" cy="312" r="4" /><circle cx="97" cy="296" r="4" />
                  <circle cx="212" cy="296" r="4" /><circle cx="246" cy="317" r="4" /><circle cx="300" cy="311" r="4" />
                  <circle cx="351" cy="384" r="4" /><circle cx="377" cy="369" r="4" />
                </g>
                <path d="M-20 151H421c26 0 35 11 47 31 14 24 39 32 75 42 44 12 69 40 81 79 12 40-6 70 17 111l39 54h-49l-34-48c-26-37-8-69-20-106-11-33-29-53-66-64-39-12-71-20-91-55-9-16-13-24-31-24H-20Z" fill="#d8e7df" />
                <path d="M-20 151H421c26 0 35 11 47 31 14 24 39 32 75 42 44 12 69 40 81 79 12 40-6 70 17 111l39 54" fill="none" stroke="#c5d8cc" strokeWidth="5" />
                <path d="M-20 170H420c17 0 22 8 33 26 15 26 43 40 82 51 37 10 54 31 64 62 11 34-7 69 22 112l30 43" fill="none" stroke="#e9f1e9" strokeWidth="2" opacity=".9" />
                <path d="M-10 207c92-23 157-18 217 2s107 37 171 30m-333 75c91-34 160-30 231 3m-124 60c71-31 129-27 187-9" fill="none" stroke="#d8d6c9" strokeWidth="17" strokeLinecap="round" />
                <path d="M-10 207c92-23 157-18 217 2s107 37 171 30m-333 75c91-34 160-30 231 3m-124 60c71-31 129-27 187-9" fill="none" stroke="#fffdf7" strokeWidth="10" strokeLinecap="round" />
                <path d="M281 129v78m8-78v78m-8-69h8m-8 12h8m-8 12h8m-8 12h8m106-61v95m9-95v95m-9-82h9m-9 13h9m-9 13h9m-9 13h9m-9 13h9m-9 13h9" fill="none" stroke="#9eaa99" strokeWidth="3" />
                <path d="M260 166h49m-49 7h49m102-40h51m-51 8h51" fill="none" stroke="#fffdf7" strokeWidth="2" />
                <path d="M226 164q20-10 40 0l-7 9h-29zm5-5 11-7 18 7" fill="#829782" />
                <g fill="none" stroke="#738671" strokeWidth="2">
                  <path d="M174 75h55m-50 0v-8h45v8m-41-9v-9h37v9m-33-10v-9h29v9m-24-10V38h19v8m-15-10V27h11v9m-8-12h5m-24 53h44" />
                  <path d="M339 86h104m-99 0v-15h94v15m-87-16 8-12h67l9 12m-84-12 8-14h48l13 14m-66-14 9-9h35l9 9m-90 49h102" />
                  <path d="M488 68c14-13 30-10 37 4 7 14-1 27-16 30-14 2-29-7-28-19m8-2 17-11 13 14-13 15-15-8z" />
                </g>
                <path d="M55 261h41v25H55zM50 261l25-19 27 19m-37 25v-12h10v12" fill="#f8f6ed" stroke="#748871" strokeWidth="2" strokeLinejoin="round" />
                <path d="M188 250h40v24h-40zM183 250l25-18 25 18m-35 24v-11h10v11" fill="#f8f6ed" stroke="#748871" strokeWidth="2" strokeLinejoin="round" />
                <path d="M313 376h70v19h-70m5-19v-10h60v10m-48-10v-8h37v8m-27-8v-8h17v8m-12-8v-9h7v9" fill="none" stroke="#748871" strokeWidth="2" />
                <text className="map-landmark-label" x="164" y="99">Chùa Thiên Mụ</text>
                <text className="map-landmark-label" x="346" y="106">Hoàng thành Huế</text>
                <text className="map-landmark-label" x="484" y="118">Cồn Hến</text>
                <text className="map-water-label" x="102" y="165">Sông Hương</text>
                <text className="map-bridge-label" x="239" y="222">Cầu Nguyễn Hoàng</text>
                <text className="map-bridge-label" x="378" y="240">Cầu Trường Tiền</text>
                <text className="map-water-label" x="548" y="297" transform="rotate(62 548 297)">Sông Như Ý</text>
                <text className="map-landmark-label" x="44" y="302">Lăng Minh Mạng</text>
                <text className="map-landmark-label" x="169" y="273">Lăng Tự Đức</text>
                <text className="map-landmark-label" x="211" y="343">Đồi Vọng Cảnh</text>
                <text className="map-landmark-label" x="310" y="414">Lăng Khải Định</text>
              </svg>
              <span className="map-pin map-pin-khome" aria-hidden="true"><Icon name="pin" size={22} /></span>
              <span className="map-label map-label-khome" aria-hidden="true">K-home <small>Huế, Vietnam</small></span>
              <a className="map-open" href={`https://www.google.com/maps/search/?api=1&query=${mapCoordinates}`} target="_blank" rel="noreferrer">
                Open in Google Maps <Icon name="arrowUpRight" size={15} />
              </a>
              <span className="map-demo">Illustrated map · 16.4720° N, 107.5977° E</span>
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand brand-footer" href="#" onClick={() => setSelectedRoom(null)}><span className="brand-mark"><Icon name="sparkle" size={22} /></span><span>K-home<span className="brand-period">.</span><small>STAY A LITTLE LONGER</small></span></a>
            <p>A little place to land.<br />A little more room to be.</p>
          </div>
          <div className="footer-links"><strong>Come on in</strong><a href="#rooms" onClick={() => setSelectedRoom(null)}>The rooms</a><a href="#story" onClick={() => setSelectedRoom(null)}>Our story</a><a href="#find-us" onClick={() => setSelectedRoom(null)}>Find us</a></div>
          <div className="footer-links"><strong>Say hello</strong><a href="https://www.instagram.com/khome.stay/" target="_blank" rel="noreferrer">Instagram <Icon name="arrowUpRight" size={13} /></a><a href="https://x.com/khome_stay" target="_blank" rel="noreferrer">X <Icon name="arrowUpRight" size={13} /></a><a href="https://www.threads.net/@khome.stay" target="_blank" rel="noreferrer">Threads <Icon name="arrowUpRight" size={13} /></a></div>
          <div className="footer-links"><strong>We’re around</strong><a href="https://t.me/khome_stay" target="_blank" rel="noreferrer">Telegram <Icon name="arrowUpRight" size={13} /></a><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp <Icon name="arrowUpRight" size={13} /></a><a href="tel:+620000000000">Call us <Icon name="arrowUpRight" size={13} /></a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 K-home Homestay</span><span>Made for the moments in between <Icon name="heart" size={14} /></span><a href="mailto:hello@khome.example">hello@khome.example</a></div>
        <p className="footer-demo-note">Preview site · Contact details, social profiles, reviews, and location are examples. Update them before launch.</p>
      </footer>

      {showAlertForm && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAlertForm(false) }}>
          <section className="alert-modal" role="dialog" aria-modal="true" aria-labelledby="alert-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setShowAlertForm(false)}><Icon name="close" /></button>
            <span className="modal-icon"><Icon name="calendar" size={22} /></span>
            {!alertPreview ? (
              <>
                <p className="eyebrow">KEEP A LITTLE HOPE</p>
                <h2 id="alert-title">Want a heads-up?</h2>
                <p>Leave your email and we’ll show you what an availability alert could look like.</p>
                <form className="alert-form" onSubmit={previewAlert}>
                  <label htmlFor="alert-email">YOUR EMAIL</label>
                  <input id="alert-email" type="email" placeholder="you@example.com" required />
                  <button className="button button-dark" type="submit">Preview my alert <Icon name="arrow" size={16} /></button>
                </form>
                <small className="modal-footnote">Demo only—this form doesn’t save or send your email.</small>
              </>
            ) : (
              <div role="status"><p className="eyebrow">YOU’RE ON THE LIST (IN THIS PREVIEW)</p><h2 id="alert-title">We’ll keep a spot warm.</h2><p>No email was sent or saved. Connect an email service to send real cancellation alerts.</p><button className="button button-dark" type="button" onClick={() => setShowAlertForm(false)}>Got it <Icon name="check" size={16} /></button></div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App

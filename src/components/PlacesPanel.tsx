import { Heart, MapPin, Navigation, Pill, Plus, Siren } from 'lucide-react'
import type { Place } from '../types'
import { useLanguage } from '../LanguageContext'

export function PlacesPanel({ places, locationLabel }: { places: Place[]; locationLabel: string }) {
  const { t } = useLanguage()
  return <section className="places-panel">
    <div className="map-panel">
      <div className="map-label"><MapPin size={13} /> {locationLabel}</div>
      <div className="map-grid" aria-hidden="true"><div className="map-park park-one" /><div className="map-park park-two" /><div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-road road-four" /><span className="map-street street-one">CALEA VICTORIEI</span><span className="map-street street-two">BD. DACIA</span><span className="map-street street-three">STR. ION NECULCE</span><span className="map-marker marker-police"><span><Siren size={14} /></span></span><span className="map-marker marker-hospital"><span><Heart size={14} /></span></span><span className="map-marker marker-clinic"><span><Plus size={15} /></span></span><span className="map-marker marker-pharmacy"><span><Pill size={14} /></span></span><span className="map-you"><i /></span></div>
      <span className="map-caption">{t('places.mapCaption')}</span>
    </div>
    <div className="place-list"><div className="place-list-top"><strong>{t('places.nearby')}</strong><span>{t('places.sample')}</span></div>
      {places.map((place) => { const name = place.id === 'pharmacy' ? t('places.pharmacyExample') : place.name; const address = place.id === 'pharmacy' ? t('places.pharmacyAddress') : place.address; return <div className="place-row" key={place.id}><div className={`place-icon ${place.category.toLowerCase()}`}>{place.category === 'Police' ? <Siren size={16} /> : place.category === 'Hospital' ? <Heart size={16} /> : place.category === 'Pharmacy' ? <Pill size={16} /> : <Plus size={17} />}</div><div className="place-info"><strong>{name}</strong><span>{address}</span></div><div className="place-distance">{place.distance}</div><a className="place-directions" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.query} ${name} ${locationLabel}`)}`} target="_blank" rel="noreferrer" aria-label={`${t('places.directions')} ${name}`}><Navigation size={15} /></a></div> })}
      <p className="place-disclaimer">{t('places.disclaimer')}</p>
    </div>
  </section>
}

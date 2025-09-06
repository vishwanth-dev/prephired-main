import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

interface CountrySelectProps {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string | undefined;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

// Common countries for authentication
const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
];

const CountrySelect = React.forwardRef<HTMLDivElement, CountrySelectProps>(
  (
    { label, labelClassName, required, error, value, onChange, className, disabled = false },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const selectedCountry = COUNTRIES.find(country => country.code === value) || COUNTRIES[0];

    const filteredCountries = COUNTRIES.filter(
      country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial.includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCountrySelect = (country: Country) => {
      onChange(country.code);
      setIsOpen(false);
      setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    return (
      <div className='space-y-2' ref={ref}>
        {label && (
          <Label className={cn('text-font-prime-color font-poppins', labelClassName)}>
            {label} {required && <span className='text-primary'>*</span>}
          </Label>
        )}

        <div className='relative'>
          <button
            type='button'
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              'flex items-center justify-between w-full min-w-0 rounded-full border px-3 py-2 shadow-xs transition-[color,box-shadow] outline-none',
              'focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
              'body-medium 2xl:body-regular',
              '2xl:px-6 2xl:py-4 md:px-4 md:py-3 px-3 py-2',
              'bg-white border-input',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-destructive',
              className
            )}
          >
            <div className='flex items-center gap-2 min-w-0'>
              <span className='text-lg'>{selectedCountry?.flag}</span>
              <span className='truncate'>{selectedCountry?.name}</span>
              <span className='text-gray-500'>{selectedCountry?.dial}</span>
            </div>
            <ChevronDown
              className={cn('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
            />
          </button>

          {isOpen && !disabled && (
            <div className='absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 max-h-60 overflow-hidden'>
              <div className='p-3 border-b border-gray-200'>
                <input
                  type='text'
                  placeholder='Search countries...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20'
                  autoFocus
                />
              </div>

              <div className='max-h-48 overflow-y-auto'>
                {filteredCountries.map(country => (
                  <button
                    key={country.code}
                    type='button'
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors',
                      'first:rounded-t-2xl last:rounded-b-2xl',
                      country.code === value && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span className='text-lg'>{country.flag}</span>
                    <span className='flex-1 text-left'>{country.name}</span>
                    <span className='text-gray-500'>{country.dial}</span>
                  </button>
                ))}

                {filteredCountries.length === 0 && (
                  <div className='px-4 py-3 text-gray-500 text-center'>No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className='text-red-500 body-small'>{error}</p>}
      </div>
    );
  }
);

CountrySelect.displayName = 'CountrySelect';

export { CountrySelect };

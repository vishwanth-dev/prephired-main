import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, PhoneIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';

// Country data with flags and codes
const countries = [
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
] as const;

type Country = (typeof countries)[number];

interface PhoneInputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void; // Simplified for react-hook-form compatibility
  onPhoneChange?: (phoneNumber: string, countryCode: string, fullNumber: string) => void; // Optional custom callback
  defaultCountry?: string;
  className?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label,
      labelClassName,
      required = false,
      error,
      value = '',
      onChange,
      onPhoneChange,
      defaultCountry = '+91',
      ...props
    },
    ref
  ) => {
    // Ensure we always have a valid country
    const getInitialCountry = () => {
      return countries.find(c => c.code === defaultCountry) || countries[0];
    };

    const [selectedCountry, setSelectedCountry] = React.useState(getInitialCountry());
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Parse the incoming value to extract country code and phone number
    const parseValue = (val: string) => {
      if (!val) return { countryCode: defaultCountry, phoneNumber: '' };

      // Check if value starts with a country code
      const matchedCountry = countries.find(country => val.startsWith(country.code));
      if (matchedCountry) {
        return {
          countryCode: matchedCountry.code,
          phoneNumber: val.slice(matchedCountry.code.length),
        };
      }

      // If no country code found, assume it's just the phone number
      return {
        countryCode: selectedCountry.code,
        phoneNumber: val,
      };
    };

    const { countryCode, phoneNumber } = parseValue(value);

    // Update selected country when value changes
    React.useEffect(() => {
      const country = countries.find(c => c.code === countryCode);
      if (country && country.code !== selectedCountry.code) {
        setSelectedCountry(country);
      }
    }, [countryCode, selectedCountry.code]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle phone number input change
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/g, ''); // Only allow digits
      const fullNumber = `${selectedCountry.code}${inputValue}`;

      // Validate against the schema pattern: /^\+?[1-9]\d{1,14}$/
      const isValidPhone = /^\+?[1-9]\d{1,14}$/.test(fullNumber);

      // Only update if valid or empty (to allow user to type)
      if (isValidPhone || fullNumber === selectedCountry.code) {
        // Call react-hook-form onChange
        if (onChange) {
          onChange(fullNumber);
        }

        // Call custom callback if provided
        if (onPhoneChange) {
          onPhoneChange(inputValue, selectedCountry.code, fullNumber);
        }
      }
    };

    // Handle country selection
    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);

      const fullNumber = `${country.code}${phoneNumber}`;

      // Validate against the schema pattern: /^\+?[1-9]\d{1,14}$/
      const isValidPhone = /^\+?[1-9]\d{1,14}$/.test(fullNumber);

      // Only update if valid or if it's just the country code (empty phone)
      if (isValidPhone || fullNumber === country.code) {
        // Update react-hook-form value
        if (onChange) {
          onChange(fullNumber);
        }

        // Call custom callback if provided
        if (onPhoneChange) {
          onPhoneChange(phoneNumber, country.code, fullNumber);
        }
      }
    };

    // Update dropdown position when opening
    const handleDropdownToggle = () => {
      if (!isDropdownOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setIsDropdownOpen(!isDropdownOpen);
    };

    // Country selector prefix component
    const CountrySelector = () => (
      <div className='relative' ref={dropdownRef}>
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors'
          onClick={handleDropdownToggle}
        >
          <span className='text-lg'>{selectedCountry.flag}</span>
          <span className='text-sm font-medium text-gray-700 min-w-fit'>
            {selectedCountry.code}
          </span>
          <ChevronDown className='h-4 w-4 text-gray-400' />
        </div>

        {/* Portal dropdown - rendered outside component tree */}
        {isDropdownOpen &&
          createPortal(
            <div
              className='fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-60 overflow-y-auto'
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${Math.max(dropdownPosition.width, 256)}px`, // Ensure minimum width
              }}
            >
              {countries.map(country => (
                <div
                  key={country.country}
                  className='flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className='text-lg'>{country.flag}</span>
                  <span className='text-sm font-medium text-gray-700 min-w-[40px]'>
                    {country.code}
                  </span>
                  <span className='text-sm text-gray-600 flex-1'>{country.name}</span>
                </div>
              ))}
            </div>,
            document.body
          )}
      </div>
    );

    // Prepare props for Input component
    const inputProps = {
      ref,
      type: 'tel' as const,
      required,
      error,
      value: phoneNumber,
      onChange: handlePhoneChange,
      prefixIcon: <CountrySelector />,
      className: cn(
        'pl-24', // Extra padding for the country selector
        className
      ),
      ...(label && { label }),
      ...(labelClassName && { labelClassName }),
      ...props,
    };

    return (
      <div className='relative'>
        <Input
          {...inputProps}
          required={required}
          suffixIcon={<PhoneIcon className='w-6 h-6 text-[#989898]' />}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };

// Usage examples:

// With react-hook-form (recommended):
/*
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <PhoneInput
          label="Phone Number"
          placeholder="Enter your phone number"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
*/

// With custom callback:
/*
<PhoneInput
  label="Phone Number"
  required
  defaultCountry="+91"
  onPhoneChange={(phoneNumber, countryCode, fullNumber) => {
    console.log('Phone:', phoneNumber);        // "9876543210"
    console.log('Country Code:', countryCode); // "+91"
    console.log('Full Number:', fullNumber);   // "+919876543210"
  }}
/>
*/

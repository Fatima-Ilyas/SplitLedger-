# SplitLedger MVP - Complete Implementation Plan

## Project Context
You are implementing a **SplitLedger MVP** - a web application for splitting fragrance bottle costs among multiple participants. The Next.js project is already set up with **App Router** and **Tailwind CSS**. Your task is to implement the complete functionality as specified below.

## Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (already configured)
- **AI Integration**: Google Gemini API for generating personalized participant summaries
- **Design**: Mobile-first, clean Google Material Design aesthetic
- **Deployment**: Environment variable configuration for production deployment

## Core Functional Requirements

### 1. Create a Fragrance Split
- Input field for fragrance name (required)
- Input field for bottle size in ml (required, must be > 0)
- Input field for bottle price (required, must be > 0)
- Input field for shipping cost (optional, defaults to 0)
- Textarea for optional notes
- Real-time validation with error messages

### 2. Manage Participants
- Dynamic participant list with add/remove functionality
- Each participant has:
  - Name field (required)
  - Requested quantity in ml (required, must be > 0)
- Edit participant details inline
- Remove participant button
- Minimum 1 participant required for cost calculation

### 3. Validate Split
- **Real-time validation**:
  - Calculate total allocated ml from all participants
  - Ensure total allocated ml ≤ bottle size
  - Display remaining ml available
  - Show clear error if requested ml exceeds bottle size
  - Prevent form submission if validation fails

### 4. Cost Calculation
- **Automatic calculations**:
  - Total Cost = Bottle Price + Shipping Cost
  - Cost per ml = Total Cost ÷ Bottle Size
  - Each Participant Cost = Requested ml × Cost per ml
- Display all calculations in real-time
- Format currency to 2 decimal places
- Update calculations instantly when any value changes

### 5. Display Results
- Summary card showing:
  - Fragrance name and details
  - Total cost breakdown
  - Cost per ml (highlighted)
  - Total allocated ml / Bottle size ml
  - Remaining ml
  - List of all participants with their costs
- Use clean, card-based layout
- Color-code validation states (green for valid, red for errors)

### 6. Generate Share Summary with Gemini API
- **AI-Generated Summary**: Use Google Gemini API to generate a personalized, friendly summary text that includes:
  - Fragrance details (name, bottle size, total cost)
  - Cost per ml
  - Individual participant breakdown (name, ml amount, cost owed)
  - Remaining ml information
  - Friendly, conversational tone suitable for sharing
- **API Integration**:
  - Use `@google/generative-ai` npm package
  - Model: `gemini-1.5-flash` or `gemini-1.5-pro`
  - API key from environment variable: `NEXT_PUBLIC_GEMINI_API_KEY`
- **Prompt Engineering**: Structure the prompt to generate ready-to-share text in this format:
  ```
  🌸 Fragrance Split Summary 🌸

  Fragrance: [Name]
  Bottle Size: [X]ml
  Total Cost: $[X] (Bottle: $[X] + Shipping: $[X])
  Cost per ml: $[X]

  💰 Participant Shares:
  • [Name]: [X]ml → $[X]
  • [Name]: [X]ml → $[X]

  📦 Remaining: [X]ml available

  [Optional friendly note]
  ```
- Display loading state while generating
- Handle API errors gracefully with fallback to basic summary

### 7. Copy Summary
- "Copy Summary" button below the generated text
- One-click copy to clipboard using Navigator Clipboard API
- Show visual feedback (toast/notification: "Copied to clipboard!")
- Button should be disabled until summary is generated

### 8. Reset Form
- "Start New Split" or "Reset" button
- Clear all form fields
- Remove all participants except the first empty one
- Reset all calculations
- Confirm before resetting if data exists

## Validation Requirements Implementation

### Field-Level Validations
```typescript
- Fragrance Name: Required, min 2 characters
- Bottle Size: Required, number, must be > 0, max 1000ml
- Bottle Price: Required, number, must be > 0, max 10000
- Shipping Cost: Optional, number, must be ≥ 0
- Participant Name: Required, min 2 characters
- Participant Quantity: Required, number, must be > 0
```

### Form-Level Validations
- Total allocated ml must not exceed bottle size
- At least 1 participant required
- All participant fields must be valid before calculation
- Display error messages clearly near the relevant field

### Error Message Examples
- "Fragrance name is required"
- "Bottle size must be greater than 0"
- "Total requested ml (120ml) exceeds bottle size (100ml)"
- "Please fix all errors before generating summary"

## Technical Implementation Details

### Project Structure
```
app/
├── page.tsx                 # Main SplitLedger page
├── components/
│   ├── FragranceForm.tsx    # Fragrance details input
│   ├── ParticipantList.tsx  # Manage participants
│   ├── CostSummary.tsx      # Display calculations
│   ├── ShareSummary.tsx     # AI-generated summary with copy
│   └── ui/
│       ├── Button.tsx       # Reusable button component
│       ├── Input.tsx        # Reusable input component
│       ├── Card.tsx         # Reusable card component
│       └── Toast.tsx        # Toast notification component
├── lib/
│   ├── calculations.ts      # Cost calculation utilities
│   ├── validations.ts       # Validation functions
│   └── gemini.ts            # Gemini API integration
└── types/
    └── split.ts             # TypeScript interfaces
```

### TypeScript Interfaces
```typescript
// types/split.ts
interface Participant {
  id: string;
  name: string;
  requestedMl: number;
}

interface FragranceDetails {
  name: string;
  bottleSize: number;
  bottlePrice: number;
  shippingCost: number;
  notes?: string;
}

interface CostBreakdown {
  totalCost: number;
  costPerMl: number;
  participantCosts: ParticipantCost[];
  allocatedMl: number;
  remainingMl: number;
}

interface ParticipantCost {
  participant: Participant;
  cost: number;
}

interface ValidationError {
  field: string;
  message: string;
}
```

### State Management
Use React `useState` hooks for:
- Fragrance details state
- Participants array state
- Validation errors state
- Generated summary state
- Loading states

Use `useEffect` for:
- Real-time calculation updates
- Validation on input changes

### Gemini API Integration

#### Installation
```bash
npm install @google/generative-ai
```

#### Environment Setup
Create `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Add to `.env.example`:
```
NEXT_PUBLIC_GEMINI_API_KEY=
```

#### Implementation (lib/gemini.ts)
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateSplitSummary(
  fragrance: FragranceDetails,
  participants: Participant[],
  costBreakdown: CostBreakdown
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate a friendly, ready-to-share summary for a fragrance split purchase. Use emojis and clear formatting.

Fragrance Details:
- Name: ${fragrance.name}
- Bottle Size: ${fragrance.bottleSize}ml
- Bottle Price: $${fragrance.bottlePrice}
- Shipping Cost: $${fragrance.shippingCost}
- Total Cost: $${costBreakdown.totalCost}
- Cost per ml: $${costBreakdown.costPerMl.toFixed(2)}

Participants:
${participants.map(p => `- ${p.name}: ${p.requestedMl}ml → $${(p.requestedMl * costBreakdown.costPerMl).toFixed(2)}`).join('\n')}

Remaining: ${costBreakdown.remainingMl}ml available

Format this as a friendly, conversational summary that can be copied and shared via WhatsApp or text. Use this structure:

🌸 Fragrance Split Summary 🌸

Fragrance: [name]
Bottle Size: [size]ml
Total Cost: $[total] (Bottle: $[bottle] + Shipping: $[shipping])
Cost per ml: $[cost]

💰 Participant Shares:
[list each participant]

📦 Remaining: [remaining]ml available

Add a brief friendly closing line if appropriate.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
```

#### Error Handling
```typescript
try {
  const summary = await generateSplitSummary(fragrance, participants, costBreakdown);
  setSummary(summary);
} catch (error) {
  console.error("Gemini API error:", error);
  // Fallback to basic summary
  setSummary(generateBasicSummary(fragrance, participants, costBreakdown));
  toast.error("AI generation unavailable, showing basic summary");
}
```

### Calculation Functions (lib/calculations.ts)
```typescript
export function calculateCostBreakdown(
  fragrance: FragranceDetails,
  participants: Participant[]
): CostBreakdown {
  const totalCost = fragrance.bottlePrice + fragrance.shippingCost;
  const costPerMl = totalCost / fragrance.bottleSize;
  const allocatedMl = participants.reduce((sum, p) => sum + p.requestedMl, 0);
  const remainingMl = fragrance.bottleSize - allocatedMl;

  const participantCosts = participants.map(p => ({
    participant: p,
    cost: p.requestedMl * costPerMl
  }));

  return {
    totalCost,
    costPerMl,
    participantCosts,
    allocatedMl,
    remainingMl
  };
}
```

### Validation Functions (lib/validations.ts)
```typescript
export function validateFragrance(fragrance: FragranceDetails): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!fragrance.name || fragrance.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Fragrance name is required (min 2 characters)' });
  }

  if (!fragrance.bottleSize || fragrance.bottleSize <= 0) {
    errors.push({ field: 'bottleSize', message: 'Bottle size must be greater than 0' });
  }

  if (!fragrance.bottlePrice || fragrance.bottlePrice <= 0) {
    errors.push({ field: 'bottlePrice', message: 'Bottle price must be greater than 0' });
  }

  if (fragrance.shippingCost < 0) {
    errors.push({ field: 'shippingCost', message: 'Shipping cost cannot be negative' });
  }

  return errors;
}

export function validateParticipants(
  participants: Participant[],
  bottleSize: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (participants.length === 0) {
    errors.push({ field: 'participants', message: 'At least one participant is required' });
    return errors;
  }

  participants.forEach((p, index) => {
    if (!p.name || p.name.trim().length < 2) {
      errors.push({ 
        field: `participant-${index}-name`, 
        message: `Participant ${index + 1}: Name is required` 
      });
    }

    if (!p.requestedMl || p.requestedMl <= 0) {
      errors.push({ 
        field: `participant-${index}-ml`, 
        message: `Participant ${index + 1}: Quantity must be greater than 0` 
      });
    }
  });

  const totalRequested = participants.reduce((sum, p) => sum + p.requestedMl, 0);
  if (totalRequested > bottleSize) {
    errors.push({ 
      field: 'allocation', 
      message: `Total requested ml (${totalRequested}ml) exceeds bottle size (${bottleSize}ml)` 
    });
  }

  return errors;
}
```

## UI/UX Design Guidelines

### Tailwind CSS Configuration
Ensure `tailwind.config.js` includes:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4f8',
          100: '#d1e9f1',
          500: '#1a73e8', // Google Blue
          600: '#1557b0',
          700: '#0d3c7a',
        },
        success: '#34a853', // Google Green
        warning: '#fbbc04', // Google Yellow
        error: '#ea4335',   // Google Red
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### Mobile-First Design Principles
1. **Touch-friendly targets**: Minimum 44×44px for all interactive elements
2. **Responsive spacing**: Use Tailwind's responsive classes (`sm:`, `md:`, `lg:`)
3. **Stack on mobile, side-by-side on desktop**: Use `flex-col md:flex-row`
4. **Full-width inputs on mobile**: `w-full`
5. **Readable font sizes**: Minimum 16px for inputs (prevents zoom on iOS)

### Component Design Pattern
```typescript
// components/ui/Input.tsx
interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function Input({ label, value, onChange, type = 'text', error, placeholder, required }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg border
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error ? 'border-error' : 'border-gray-300'}
        `}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}
```

### Layout Structure
```tsx
// app/page.tsx main layout
<div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">SplitLedger</h1>
      <p className="text-gray-600 mt-2">Split fragrance costs fairly</p>
    </header>

    <div className="space-y-6">
      {/* Fragrance Form Card */}
      <Card>
        <FragranceForm />
      </Card>

      {/* Participants Card */}
      <Card>
        <ParticipantList />
      </Card>

      {/* Cost Summary Card */}
      {costBreakdown && (
        <Card>
          <CostSummary breakdown={costBreakdown} />
        </Card>
      )}

      {/* Share Summary Card */}
      {summary && (
        <Card>
          <ShareSummary summary={summary} onCopy={handleCopy} />
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleGenerateSummary} disabled={hasErrors}>
          Generate Summary
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  </div>
</div>
```

## Implementation Steps

### Step 1: Setup and Dependencies
1. Verify Next.js App Router and Tailwind CSS are configured
2. Install Gemini API package: `npm install @google/generative-ai`
3. Create `.env.local` with `NEXT_PUBLIC_GEMINI_API_KEY`
4. Create TypeScript interfaces in `types/split.ts`

### Step 2: Build Utility Functions
1. Implement `lib/calculations.ts` with cost calculation functions
2. Implement `lib/validations.ts` with validation functions
3. Implement `lib/gemini.ts` with Gemini API integration
4. Write unit tests for calculation and validation functions (optional but recommended)

### Step 3: Create UI Components
1. Build base UI components in `components/ui/`:
   - `Input.tsx` - Text and number inputs with validation
   - `Button.tsx` - Primary, secondary, outline variants
   - `Card.tsx` - Container with shadow and padding
   - `Toast.tsx` - Success/error notifications
2. Style components with Tailwind CSS following Google Material Design

### Step 4: Build Feature Components
1. **FragranceForm.tsx**:
   - Inputs for name, bottle size, price, shipping, notes
   - Real-time validation display
   - Error message handling
2. **ParticipantList.tsx**:
   - Add/remove participant functionality
   - Inline editing for each participant
   - Validation for each participant row
   - Display total allocated ml
3. **CostSummary.tsx**:
   - Display all calculations
   - Show breakdown per participant
   - Highlight remaining ml (green if available, red if over-allocated)
4. **ShareSummary.tsx**:
   - Display AI-generated summary text
   - Copy to clipboard button
   - Loading state during generation
   - Success feedback on copy

### Step 5: Main Page Integration
1. Set up state management in `app/page.tsx`
2. Connect all components with proper prop passing
3. Implement form submission and reset logic
4. Add loading states and error boundaries
5. Test all validation scenarios

### Step 6: Gemini API Integration
1. Test Gemini API connection with sample data
2. Implement summary generation with error handling
3. Add fallback to basic summary if API fails
4. Test with various input scenarios
5. Optimize prompt for best output quality

### Step 7: Polish and Optimization
1. Test on various mobile devices and screen sizes
2. Ensure all touch targets are appropriately sized
3. Add smooth transitions and micro-interactions
4. Verify copy-to-clipboard works across browsers
5. Test with edge cases (very long names, large numbers, many participants)
6. Add loading skeletons for better UX
7. Ensure accessibility (keyboard navigation, screen readers)

### Step 8: Final Testing
1. **Validation Testing**:
   - Empty fields
   - Negative values
   - Over-allocation
   - Zero values
2. **Calculation Testing**:
   - Verify accuracy with various inputs
   - Test edge cases (0 shipping, many participants)
3. **UI Testing**:
   - Mobile responsiveness
   - Copy functionality
   - Reset functionality
4. **API Testing**:
   - Test with valid API key
   - Test error handling with invalid key
   - Test fallback summary

## Example User Flow

1. User opens the app
2. Fills in fragrance details:
   - Name: "Aventus Creed"
   - Bottle Size: 100ml
   - Bottle Price: $350
   - Shipping: $15
3. Adds participants:
   - John: 30ml
   - Sarah: 25ml
   - Mike: 20ml
4. App automatically calculates:
   - Total Cost: $365
   - Cost per ml: $3.65
   - John owes: $109.50
   - Sarah owes: $91.25
   - Mike owes: $73.00
   - Remaining: 25ml
5. User clicks "Generate Summary"
6. Gemini API generates friendly text
7. User clicks "Copy Summary"
8. Toast shows "Copied to clipboard!"
9. User shares the summary via WhatsApp/text

## Key Deliverables Checklist

- [ ] All input fields with proper validation
- [ ] Dynamic participant management (add/edit/remove)
- [ ] Real-time cost calculations
- [ ] Allocation validation (cannot exceed bottle size)
- [ ] Gemini API integration for summary generation
- [ ] Copy to clipboard functionality
- [ ] Reset form functionality
- [ ] Mobile-responsive design
- [ ] Clean Google Material Design UI
- [ ] Error handling and user feedback
- [ ] Environment variable configuration
- [ ] Loading states for async operations
- [ ] Toast notifications for user actions
- [ ] No page reloads (SPA behavior)
- [ ] TypeScript type safety throughout

## Performance Considerations

1. **Debounce calculations**: Use debouncing for real-time calculations to avoid excessive re-renders
2. **Memoization**: Use `useMemo` for expensive calculations
3. **Lazy loading**: Code-split components if bundle size grows
4. **API caching**: Cache Gemini API responses for identical inputs (optional)
5. **Input optimization**: Use controlled components efficiently

## Accessibility Requirements

1. Proper semantic HTML (`<form>`, `<label>`, `<button>`)
2. ARIA labels where needed
3. Keyboard navigation support (Tab, Enter, Escape)
4. Focus management (focus first error on validation)
5. Error announcements for screen readers
6. Sufficient color contrast (WCAG AA minimum)

## Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Deployment Checklist

- [ ] `.env.example` created with required variables
- [ ] `.env.local` added to `.gitignore`
- [ ] Build succeeds without errors: `npm run build`
- [ ] All TypeScript errors resolved
- [ ] Gemini API key configured in production environment
- [ ] Test deployed version on mobile devices
- [ ] Verify HTTPS for clipboard API to work

## Reference Documentation

- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS: https://tailwindcss.com/docs
- Google Gemini API: https://ai.google.dev/gemini-api/docs
- TypeScript: https://www.typescriptlang.org/docs
- Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

## Success Criteria

The MVP is complete when:
1. Users can create a split with fragrance details
2. Users can add/remove multiple participants
3. Costs are calculated accurately in real-time
4. Validation prevents over-allocation
5. Gemini API generates friendly summaries
6. Users can copy summary with one click
7. All functionality works on mobile devices
8. UI follows Google Material Design principles
9. No console errors in production build
10. App can be deployed with environment variables

---

**Important Notes for Implementation:**

- Start with the utility functions and TypeScript interfaces
- Build components from smallest to largest (UI components → feature components → page)
- Test each component in isolation before integration
- Use TypeScript strictly - no `any` types
- Follow mobile-first responsive design
- Implement loading states for all async operations
- Handle all edge cases and validation scenarios
- Refer to Google Gemini API docs for latest best practices: https://ai.google.dev/gemini-api/docs

**This plan is complete and ready for direct implementation. Begin with Step 1 and proceed sequentially.**
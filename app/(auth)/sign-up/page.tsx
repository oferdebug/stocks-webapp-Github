'use client';
import {useForm} from 'react-hook-form';
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/inputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import CountrySelectField from "@/components/forms/countrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

function SignUp() {
    const router=useRouter();
  {/* Initialize form state with validation rules and default values */}
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology'
    },
    mode: 'onBlur'
  });

  {/* Process form submission with error handling */}
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data);
          
          if (result && result.success) {
            toast.success('Account created successfully!');
            router.push('/');
          } else {
            toast.error(result?.message || 'Sign Up Failed');
          }
        } catch (e) {
          console.error(e);
          toast.error('An unexpected error occurred. Please try again.');
        }
  };

  return (
      <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          // suppressHydrationWarning
      >
          <InputField
              name="fullName"
          label="Full Name"
          placeholder="Sarah Mitchell"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full Name Is Required', minLength: 2 }}
        />
        <InputField
          name="email"
          label="Email"
          placeholder="contact@NextTrade.com"
          register={register}
          error={errors.email}
          validation={{ required: 'Full Email Is Required', minLength: 2 }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter A Strong Password"
          register={register}
          type="password"
          error={errors.password}
          validation={{ required: 'Password Is Required', minLength: 8 }}
        />

        {/* Geographic location selection */}
        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
          placeholder=""
        />

        {/* Investment profile customization */}
        <SelectField
          name="investmentGoals"
          label="Investment Goals"
          placeholder="Select Your Investment Goals"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />
        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select Your Preferred Industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />
        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select Your Risk Level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        {/* Form submission with async state management */}
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="green-btn w-full mt-5"
        >
          {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey Today'}
        </Button>

        <FooterLink 
          text="Already Have An Account?" 
          linkText="SignIn" 
          href="/sign-in" 
        />
      </form>
  );
}

export default SignUp;
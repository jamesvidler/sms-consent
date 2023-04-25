import React, { useState } from "react";
import {
  useExtensionApi,
  render,
  Banner,
  useSubscription,
  Text,
  TextBlock,
  Checkbox,
  InlineLayout,
  BlockSpacer,
  BlockStack,
  Link,
  View,
  usePhone,
  PhoneField,
} from "@shopify/checkout-ui-extensions-react";

render("Checkout::Dynamic::Render", () => <App />);

function App() {
  const {
    smsMarketingPhone,
    setSmsMarketingPhone,
    acceptSmsMarketing,
    setAcceptSmsMarketing,
  } = useExtensionApi();

  // `smsPhone`: The state of the sms phone (from an atom) that ultimately is passed as part of the negotation.
  //             It sets the initial value based on some logic in checkout-web.
  //
  //  Unknown buyer (guest checkout):
  //    1. Uses unknown buyer's phone number if entered as contact information (instead of email).
  //    2. Fallback to use the shipping phone number if already provided.
  //
  //  Known buyer (logged in - Classic Accounts):
  //    1. TODO: Find out how this value can be set, because it ignored a logged-in customer's phone number
  //    2. Fallback to use the shipping phone number if already provided.
  //
  // You can **overwrite** the value at any time using `setSmsMarketingPhone`.
  const smsPhone = useSubscription(smsMarketingPhone);

  // `smsMarketing` This is the state flag which represents if the customer opted into (opt-in only) to SMS marketing.
  //  It does not represent the existing state of the customer's subscription status, nor the intention to unsubscribe.
  const smsMarketing = useSubscription(acceptSmsMarketing);

  const [phoneFieldDisabled, setPhoneFieldDisabled] = useState(false);

  // This will return a phone number, only if it is being used as the primary contact (and not email)
  let contactPhone = usePhone();

  if (contactPhone && !phoneFieldDisabled) {
    setPhoneFieldDisabled(true);
  } else if (!contactPhone && phoneFieldDisabled) {
    setPhoneFieldDisabled(false);
  }

  return (
    <>
      <Banner title="Custom SMS Consent"></Banner>
      <BlockSpacer />
      <Checkbox
        value={smsMarketing as boolean}
        onChange={(value) => setAcceptSmsMarketing(value)}
      >
        [Custom] Text me with news and offers
      </Checkbox>
      <InlineLayout columns={["5%", "fill"]}>
        <View />
        <BlockStack>
          <TextBlock />
          {smsMarketing && (
            <>
              <PhoneField
                icon="mobile"
                label="Mobile phone number"
                readonly={phoneFieldDisabled}
                value={smsPhone as string}
                onChange={(value) => setSmsMarketingPhone(value)}
              />
              <Text size="small" appearance="subdued">
                By signing up via text, you agree to receive recurring automated
                marketing messages, including cart reminders, at the phone
                number provided. Consent is not a condition of purchase. Reply
                STOP to unsubscribe. Reply HELP for help. Message frequency
                varies. Msg & data rates may apply. View our{" "}
                <Link>Privacy Policy</Link> and <Link>Terms of Service</Link>.
              </Text>
            </>
          )}
        </BlockStack>
      </InlineLayout>
    </>
  );
}

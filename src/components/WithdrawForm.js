import React, { useContext } from "react";

import { Formik } from "formik";
import { Form, InputGroup } from "react-bootstrap";

import {
  Web3ModalContext,
  CurrentUserContext,
  ContractContext,
} from "../contexts/Store";

import { DepositSchema } from "./Validation";
import { CONTAINER, DEPOSITFORM, BUTTON } from "./Form.styled";
import { TokenInfo } from "./TokenInfo";

export const WithdrawForm = () => {
  const [web3Modal] = useContext(Web3ModalContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [contract] = useContext(ContractContext);

  return (
    <CONTAINER>
      <Formik
        initialValues={{
          amount: "",
        }}
        validationSchema={DepositSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            const weiValue = web3Modal.web3.utils.toWei("" + values.amount);
            await contract.methods
              .withdraw(weiValue)
              .send({ from: currentUser.username });
            setCurrentUser({
              ...currentUser,
              ...{
                wethBalance: +currentUser.wethBalance - values.amount,
                ethBalance: +currentUser.wethBalance + values.amount,
              },
            });
          } catch (err) {
            console.log(err);
          } finally {
            setSubmitting(false);
            resetForm();
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <DEPOSITFORM onSubmit={handleSubmit} className="mx-auto">
            <Form.Group controlId="depositForm">
              <Form.Label>
                w<span>{currentUser?.network.chain}</span>
              </Form.Label>
              <TokenInfo />
              <InputGroup>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Amount to unwrap"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  className={touched.amount && errors.amount ? "error" : null}
                />
                <InputGroup.Append>
                  <BUTTON
                    variant="primary"
                    onClick={() =>
                      setFieldValue(
                        "amount",
                        currentUser.wethBalance
                      )
                    }
                  >
                    Set Max
                  </BUTTON>
                </InputGroup.Append>
              </InputGroup>

              {touched.amount && errors.amount ? (
                <div className="error-message">{errors.amount}</div>
              ) : null}
            </Form.Group>

            <BUTTON
              variant="primary"
              type="submit"
              size="lg"
              block
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading…" : "Submit"}
            </BUTTON>
          </DEPOSITFORM>
        )}
      </Formik>
    </CONTAINER>
  );
};

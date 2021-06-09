import React, { useState } from 'react';
import { useCompareUsers } from '../../../../../../components/hooks';
import { AutoLoader } from '../../../../../../components/loaders';
import { TitleBar, TitleToggler, Widget, 
    WidgetCollapsible } from '../../../../../../components/widgets';

import AddSection from './addSection';
import ListSection from './listSection';


export default function PaymentSection(props) {
    const [state, setState] = useState({
        payments: [],
        limit: 10
    });
    
    async function appendPayments() {
        try {
            const url = `/api/appointments/${props.appointment.id}/payments`;

            const searchParams = new URLSearchParams();
            searchParams.append('page', Math.ceil(state.payments.length / state.limit));
            searchParams.append('limit', state.limit);
            
            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newPayments = await response.json();
            if (!response.ok) {
                throw new Error(newPayments.message);
            }

            setState(prevState => {
                const updatedPayments = [...prevState.payments, ...newPayments];

                return {
                    ...prevState,
                    payments: updatedPayments
                }
            })
        } catch (err) {
            console.error(`Failed to append more payments. ${err}`);
        }
    }

    async function appendPayment(newPayment) {
        setState(prevState => {
            const newPayments = [newPayment, ...prevState.payments];

            return {
                ...prevState,
                payments: newPayments
            }
        });
    }

    async function deletePayment(id) {
        try {
            const response = await fetch(`/api/appointments/${props.appointment.id}/payments/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setState(prevState => {
                const newPayments = state.payments.filter(payment => {
                    return payment.id !== id;
                });

                return {
                    ...prevState,
                    payments: newPayments
                }
            });
        } catch (err) {
            console.error(`Failed to delete payment- ${id}. ${err}`);
        }
    }


    // Now render view
    const isCurrentUserPatient = useCompareUsers(props.session, props.appointment.patient);

    return (
        <>
            <Widget>
                <TitleBar title="Payments">
                    {isCurrentUserPatient &&
                        <TitleToggler 
                            target="apptPaymentAdd01"
                            expandIcon="add"
                            collapseIcon="clear"
                        />
                    }
                </TitleBar>
                <WidgetCollapsible id="apptPaymentAdd01">
                    <AddSection 
                        session={props.session}
                        appointment={props.appointment}
                        appendPayment={appendPayment}
                    />
                </WidgetCollapsible>
                <ListSection
                    session={props.session}
                    payments={state.payments}
                    deletePayment={deletePayment}
                />
            </Widget>
            <AutoLoader callback={appendPayments} />
        </>
    );
}
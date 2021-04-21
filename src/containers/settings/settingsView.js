import React from 'react';
import { SessionContext } from '../../context/context.js';
import { FluidContainer, Col } from "../../components/layout.js";
import { WidgetRow } from "../../components/widget.js";

import GeneralWidget from "./widgets/generalWidget.js";
import ProfilePhotoWidget from "./widgets/profilePhotoWidget.js";
import PasswordWidget from "./widgets/passwordWidget.js";
import ContactWidget from "./widgets/contactWidget.js";
import PhysicianWidget from "./widgets/physicianWidget.js";
import DeleteUserWidget from "./widgets/deleteUserWidget.js";


export default function SettingsView(props) {
  return (
    <FluidContainer>
      <WidgetRow>
        <Col className="col-xl-10">
          <GeneralWidget
            session={props.session}
          />
        </Col>
      </WidgetRow>
      <WidgetRow>
        <Col className="col-xl-10">
          <ProfilePhotoWidget
            session={props.session}
          />
        </Col>
      </WidgetRow>
      <WidgetRow>
        <Col className="col-xl-10">
          <PasswordWidget
            session={props.session}
          />
        </Col>
      </WidgetRow>
      <WidgetRow>
        <Col className="col-xl-10">
          <ContactWidget
            session={props.session}
          />
        </Col>
      </WidgetRow>
      {props.session.isPhysician &&
        <WidgetRow>
          <Col className="col-xl-10">
            <PhysicianWidget
              session={props.session}
            />
          </Col>
        </WidgetRow>
      }
      <WidgetRow>
        <Col className="col-xl-10">
          <DeleteUserWidget
            session={props.session}
            setSession={props.setSession}
          />
        </Col>
      </WidgetRow>
    </FluidContainer>
  );
}

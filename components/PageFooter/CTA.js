/* @flow */

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import {config} from 'config';
import cx from 'classnames';
import React from 'react';

const {contactEmail} = config;

const CTA = ({className}: {className?: string}) => (
  <p id="contact" className={cx('db', className)}>
    {'Пишите нам с любыми вопросами – мы всегда рады ответить!'}
    <br />
    <a href={`mailto:${contactEmail}`} className="dib f3 f2-l mt3">
      {contactEmail}
    </a>
  </p>
);

export default CTA;
